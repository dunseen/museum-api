import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FilesMinioService } from './files.service';
import { RelationalFilePersistenceModule } from '../../persistence/relational/relational-persistence.module';
import { AllConfigType } from '../../../../config/config.type';
import { MinioStorageEngine } from './minio-storage.engine';
import { MulterModule } from '@nestjs/platform-express';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { MinioModule, MinioService } from 'nestjs-minio-client';
import { MinioBucketInitializerService } from './minio-bucket-initializer.service';

const infrastructurePersistenceModule = RelationalFilePersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          endPoint: configService.getOrThrow('file.minio.endpoint', {
            infer: true,
          }),
          port: configService.getOrThrow('file.minio.port', { infer: true }),
          useSSL: configService.getOrThrow('file.minio.ssl', { infer: true }),
          accessKey: configService.getOrThrow('file.minio.accessKey', {
            infer: true,
          }),
          secretKey: configService.getOrThrow('file.minio.secretKey', {
            infer: true,
          }),
        };
      },
      isGlobal: true,
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, MinioService],
      useFactory: (
        configService: ConfigService<AllConfigType>,
        minioService: MinioService,
      ) => {
        const bucketName = configService.getOrThrow('file.minio.bucket', {
          infer: true,
        });

        const storage = new MinioStorageEngine(
          minioService.client as any,
          bucketName,
          {
            bucket: bucketName,
            path: '',
            object: {
              useOriginalFilename: false,
              name(_req, file) {
                return `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`;
              },
            },
          },
        );

        return {
          fileFilter: (_req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
              return callback(
                new UnprocessableEntityException({
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                    file: `cantUploadFileType`,
                  },
                }),
                false,
              );
            }

            callback(null, true);
          },
          storage,
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [FilesMinioService, MinioBucketInitializerService],
  exports: [FilesMinioService],
})
export class FileMinioModule {}
