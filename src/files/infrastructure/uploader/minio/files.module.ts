import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilesMinioController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FilesMinioService } from './files.service';
import { RelationalFilePersistenceModule } from '../../persistence/relational/relational-persistence.module';
import { AllConfigType } from '../../../../config/config.type';
import { MinioStorageEngine } from '@namatery/multer-minio';
import { MulterModule } from '@nestjs/platform-express';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { MinioModule, MinioService } from 'nestjs-minio-client';

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
      useFactory: async (
        configService: ConfigService<AllConfigType>,
        minioService: MinioService,
      ) => {
        const bucketName = configService.getOrThrow('file.minio.bucket', {
          infer: true,
        });

        try {
          const exists = await minioService.client.bucketExists(bucketName);
          if (!exists) {
            await minioService.client.makeBucket(bucketName);
            console.log(`✅ Bucket "${bucketName}" created successfully.`);
            const policy = {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Principal: '*',
                  Action: ['s3:GetObject'],
                  Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
              ],
            };

            await minioService.client.setBucketPolicy(
              bucketName,
              JSON.stringify(policy),
            );
            console.log(`✅ Bucket "${bucketName}" policy set successfully.`);
          } else {
            console.log(`⚡ Bucket "${bucketName}" already exists.`);
          }
        } catch (error) {
          console.error('❌ Error ensuring bucket exists:', error);
        }

        const storage = new MinioStorageEngine(
          minioService.client as any,
          bucketName,
          {
            bucket: configService.getOrThrow('file.minio.bucket', {
              infer: true,
            }),
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
  controllers: [FilesMinioController],
  providers: [FilesMinioService],
  exports: [FilesMinioService],
})
export class FileMinioModule {}
