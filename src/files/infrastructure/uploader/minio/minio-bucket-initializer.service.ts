import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import { AllConfigType } from '../../../../config/config.type';

@Injectable()
export class MinioBucketInitializerService implements OnModuleInit {
  private readonly logger = new Logger(MinioBucketInitializerService.name);

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    const bucketName = this.configService.getOrThrow('file.minio.bucket', {
      infer: true,
    });

    try {
      const exists = await this.minioService.client.bucketExists(bucketName);

      if (!exists) {
        await this.minioService.client.makeBucket(bucketName);
        this.logger.log(`Bucket "${bucketName}" created successfully.`);

        await this.setPublicReadPolicy(bucketName);
        this.logger.log(`Bucket "${bucketName}" policy set successfully.`);
      } else {
        this.logger.log(`Bucket "${bucketName}" already exists.`);
      }
    } catch (error) {
      this.logger.error(`Error ensuring bucket "${bucketName}" exists:`, error);
      // Don't throw - allow app to start even if bucket setup fails
      // The bucket might exist but we lack permissions to check, etc.
    }
  }

  private async setPublicReadPolicy(bucketName: string): Promise<void> {
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

    await this.minioService.client.setBucketPolicy(
      bucketName,
      JSON.stringify(policy),
    );
  }
}
