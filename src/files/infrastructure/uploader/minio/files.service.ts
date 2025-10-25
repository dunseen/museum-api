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
import { basename } from 'path';

export type FileDiffResult = {
  added: Array<{ id: string; url: string; path: string }>;
  removed: Array<{ id: string; url: string; path: string }>;
};
@Injectable()
export class FilesMinioService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly minioService: MinioService,
  ) {}

  async save(
    data: {
      path: string;
      characteristicId?: number;
      specieId?: number;
      fileStream: Readable | Buffer | string;
      approved?: boolean;
      changeRequestId?: number;
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
        approved: f.approved ?? false,
        changeRequestId: f.changeRequestId,
      };
    });

    const files = await Promise.all(mappedFilesKey);
    const response = await this.fileRepository.create(files);

    return response.map((file) => ({ file }));
  }

  async softDelete(uuids: string[]): Promise<void> {
    const bucket = this.configService.getOrThrow('file.minio.bucket', {
      infer: true,
    });

    const filesPromise = uuids.map(async (uuid) => {
      const file = await this.fileRepository.findById(uuid);

      if (!file) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'notFound',
          },
        });
      }

      return file;
    });

    const files = await Promise.all(filesPromise);

    // Soft delete: move files to /removed/ subpath instead of deleting from bucket
    const moveOperations = files.map(async (file) => {
      const removedPath = file.path.replace(/\/([^\/]+)$/, '/removed/$1');

      try {
        // Copy to removed location
        const readStream = await this.minioService.client.getObject(
          bucket,
          file.path,
        );
        await this.minioService.client.putObject(
          bucket,
          removedPath,
          readStream,
        );

        // Delete from original location
        await this.minioService.client.removeObject(bucket, file.path);

        return {
          ...file,
          newPath: removedPath,
          newUrl: this.generateUrl(removedPath, bucket),
        };
      } catch (error) {
        // If move fails, log but continue with soft delete in DB
        console.error(`Failed to move file ${file.path} to removed:`, error);
        return {
          ...file,
          newPath: file.path,
          newUrl: file.url,
        };
      }
    });

    const movedFiles = await Promise.all(moveOperations);

    // Update file records with new paths using save (updates if exists)
    await this.fileRepository.create(movedFiles);

    // Soft delete the files
    await this.fileRepository.delete(uuids);
  }

  async copyFilesToSpecie(
    filePaths: string[],
    specieId: number,
  ): Promise<{ path: string; url: string }[]> {
    const bucket = this.configService.getOrThrow('file.minio.bucket', {
      infer: true,
    });

    const copyPromises = filePaths.map(async (filePath) => {
      const destPath = `/species/${specieId}/${basename(filePath)}`;
      const readStream = await this.minioService.client.getObject(
        bucket,
        filePath,
      );
      const payload = [
        {
          path: destPath,
          url: this.generateUrl(destPath, bucket),
          specieId: specieId,
          approved: true,
        },
      ];

      await this.minioService.client.putObject(bucket, destPath, readStream);
      await this.fileRepository.create(payload);

      return { path: destPath, url: this.generateUrl(destPath, bucket) };
    });

    return Promise.all(copyPromises);
  }

  async moveCrFilesToSpecies(changeRequestId: number, specieId: number) {
    const crFiles =
      await this.fileRepository.findByChangeRequest(changeRequestId);

    if (!crFiles.length) return;

    const crFilePaths = crFiles.map((f) => f.path);

    await this.copyFilesToSpecie(crFilePaths, specieId);
  }

  computeFileDiff(
    existingFiles: FileType[],
    newFiles: FileType[],
    filesToDeleteIds?: string[],
  ): FileDiffResult {
    const existingFileIds = new Set(existingFiles.map((f) => f.id));

    // Compute added files: files in newFiles that aren't in existingFiles
    const added = newFiles
      .filter((f) => !existingFileIds.has(f.id))
      .map((f) => ({
        id: f.id,
        path: f.path,
        url: f.url,
      }));

    const removed = filesToDeleteIds?.length
      ? existingFiles
          .filter((f) => filesToDeleteIds.includes(f.id))
          .map((f) => ({
            id: f.id,
            path: f.path,
            url: f.url,
          }))
      : [];

    return { added, removed };
  }

  private generateUrl(file: string, bucket: string): string {
    const host = this.configService.getOrThrow('file.minio.publicEndpoint', {
      infer: true,
    });
    const port = this.configService.getOrThrow('file.minio.port', {
      infer: true,
    });
    const useSsl = this.configService.get('file.minio.ssl', {
      infer: true,
    });

    const protocol = useSsl ? 'https' : 'http';
    const portSuffix = useSsl || port === 80 || port === 443 ? '' : `:${port}`;

    return `${protocol}://${host}${portSuffix}/${bucket}${file}`;
  }
}
