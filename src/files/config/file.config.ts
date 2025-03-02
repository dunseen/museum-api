import { registerAs } from '@nestjs/config';

import { IsNumber, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { FileConfig } from './file-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  MINIO_PUBLIC_ENDPOINT: string;
  @IsString()
  MINIO_ENDPOINT: string;
  @IsString()
  MINIO_PORT: string;
  @IsString()
  MINIO_ROOT_USER: string;
  @IsString()
  MINIO_ROOT_PASSWORD: string;
  @IsString()
  MINIO_BUCKET: string;
  @IsNumber()
  MAX_FILE_SIZE: number;
}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE!, 10),
    minio: {
      endpoint: process.env.MINIO_ENDPOINT,
      publicEndpoint: process.env.MINIO_PUBLIC_ENDPOINT,
      port: Number(process.env.MINIO_PORT) ?? 9000,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
      bucket: process.env.MINIO_BUCKET,
      ssl: process.env.MINIO_SSL === 'true',
    },
  };
});
