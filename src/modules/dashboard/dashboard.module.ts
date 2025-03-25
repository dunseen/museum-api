import { Module } from '@nestjs/common';
import { DashboardPostsController } from './dashboard-posts.controller';
import { PostsModule } from '../../posts/posts.module';
import { CharacteristicsModule } from '../../characteristics/characteristics.module';
import { DashboardCharacteristicsController } from './dashboard-characteristics.controller';
import { DashboardSummaryController } from './dashboard-summary.controller';
import { TaxonsModule } from '../../taxons/taxons.module';
import { ListDashboardSummaryUseCase } from './application/use-cases/list-summary.use-case';
import { SpeciesModule } from '../../species/species.module';
import { DashboardCharacteristicTypesController } from './dashboard-characteristic-types.controller';
import { CharacteristicTypesModule } from '../../characteristic-types/characteristic-types.module';
import { FileMinioModule } from '../../files/infrastructure/uploader/minio/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import { AllConfigType } from '../../config/config.type';
import { MinioStorageEngine } from '@namatery/multer-minio';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DashboardSpeciesController } from './dashboard-species.controller';
import { DashboardTaxonsController } from './dashboard-taxons.controller';
import { DashboardHierarchiesController } from './dashboard-hierarchies.controller';
import { HierarchiesModule } from '../../hierarchies/hierarchies.module';

@Module({
  imports: [
    PostsModule,
    CharacteristicsModule,
    CharacteristicTypesModule,
    TaxonsModule,
    HierarchiesModule,
    SpeciesModule,
    FileMinioModule,
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
            // TODO uncomment this when we have the correct file types
            // if (!file.originalname.match(/\.(jpg|jpeg|png)$/i) ) {
            //   return callback(
            //     new UnprocessableEntityException({
            //       status: HttpStatus.UNPROCESSABLE_ENTITY,
            //       errors: {
            //         file: `cantUploadFileType`,
            //       },
            //     }),
            //     false,
            //   );
            // }

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
  providers: [ListDashboardSummaryUseCase],
  controllers: [
    DashboardPostsController,
    DashboardCharacteristicsController,
    DashboardCharacteristicTypesController,
    DashboardTaxonsController,
    DashboardHierarchiesController,
    DashboardSpeciesController,
    DashboardSummaryController,
  ],
})
export class DashboardModule {}
