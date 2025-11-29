import { Request } from 'express';
import { StorageEngine } from 'multer';
import { Client as MinioClient } from 'minio';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export interface MinioStorageOptions {
  bucket: string;
  path?: string;
  object?: {
    useOriginalFilename?: boolean;
    name?: (req: Request, file: Express.Multer.File) => string;
  };
}

export class MinioStorageEngine implements StorageEngine {
  constructor(
    private readonly client: MinioClient,
    private readonly bucketName: string,
    private readonly options: MinioStorageOptions,
  ) {}

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    const fileName = this.getFileName(req, file);
    const path = this.options.path
      ? `${this.options.path}/${fileName}`
      : fileName;

    const chunks: any[] = [];

    file.stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    file.stream.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);

        await this.client.putObject(
          this.bucketName,
          path,
          buffer,
          buffer.length,
          {
            'Content-Type': file.mimetype,
          },
        );

        callback(null, {
          path,
          size: buffer.length,
          filename: fileName,
          destination: this.bucketName,
          buffer,
        });
      } catch (error) {
        callback(error);
      }
    });

    file.stream.on('error', (error) => {
      callback(error);
    });
  }

  _removeFile(
    _req: Request,
    file: Express.Multer.File & { path?: string },
    callback: (error: Error | null) => void,
  ): void {
    if (!file.path) {
      return callback(null);
    }

    this.client
      .removeObject(this.bucketName, file.path)
      .then(() => callback(null))
      .catch((error) => callback(error));
  }

  private getFileName(req: Request, file: Express.Multer.File): string {
    if (this.options.object?.name) {
      return this.options.object.name(req, file);
    }

    if (this.options.object?.useOriginalFilename) {
      return file.originalname;
    }

    const extension = file.originalname.split('.').pop()?.toLowerCase();
    return `${randomStringGenerator()}.${extension}`;
  }
}
