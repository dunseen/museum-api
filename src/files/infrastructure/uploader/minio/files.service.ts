import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from '../../../domain/file';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../config/config.type';
import { MinioService } from 'nestjs-minio-client';
import { Readable } from 'stream';

@Injectable()
export class FilesMinioService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly minioService: MinioService,
  ) {}

  async create(
    file: Express.MulterS3.File[],
    {
      characteristicId,
      specieId,
    }: { characteristicId?: number; specieId?: number },
  ): Promise<{ file: FileType }[]> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    const mappedFilesKey: Omit<FileType, 'id'>[] = file.map((f) => ({
      path: f.path,
      url: this.generateUrl(f.filename, f.bucket),
      characteristicId,
      specieId,
    }));

    const response = await this.fileRepository.create(mappedFilesKey);

    return response.map((file) => ({ file }));
  }

  async save(
    data: {
      path: string;
      characteristicId?: number;
      specieId?: number;
      fileStream: Readable | Buffer | string;
    }[],
  ): Promise<{ file: FileType }[]> {
    const bucket = this.configService.getOrThrow('file.minio.bucket', {
      infer: true,
    });

    const mappedFilesKey = data.map(async (f) => {
      await this.minioService.client.putObject(bucket, f.path, f.fileStream);

      return {
        path: f.path,
        url: this.generateUrl(f.path, bucket),
        characteristicId: f.characteristicId,
        specieId: f.specieId,
      };
    });

    const files = await Promise.all(mappedFilesKey);
    const response = await this.fileRepository.create(files);

    return response.map((file) => ({ file }));
  }

  async delete(uuids: string[]): Promise<void> {
    const bucket = this.configService.getOrThrow('file.minio.bucket', {
      infer: true,
    });

    const pathsPromise = uuids.map(async (uuid) => {
      const file = await this.fileRepository.findById(uuid);

      if (!file) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'notFound',
          },
        });
      }

      return file.path;
    });

    const paths = await Promise.all(pathsPromise);

    await Promise.all([
      this.minioService.client.removeObjects(bucket, paths),
      this.fileRepository.delete(uuids),
    ]);
  }

  private generateUrl(file: string, bucket: string): string {
    const host = this.configService.getOrThrow('file.minio.publicEndpoint', {
      infer: true,
    });
    const port = this.configService.getOrThrow('file.minio.port', {
      infer: true,
    });

    const ssl = this.configService.getOrThrow('file.minio.ssl', {
      infer: true,
    });

    if (ssl) {
      return `https://${host}:${port}/${bucket}/${file}`;
    }

    return `http://${host}:${port}/${bucket}/${file}`;
  }
}
