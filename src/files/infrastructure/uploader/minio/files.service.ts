import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from '../../../domain/file';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../config/config.type';

@Injectable()
export class FilesMinioService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: ConfigService<AllConfigType>,
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

  private generateUrl(file: string, bucket: string): string {
    const host = this.configService.getOrThrow('file.minio.publicEndpoint', {
      infer: true,
    });
    const port = this.configService.getOrThrow('file.minio.port', {
      infer: true,
    });

    return `${host}:${port}/${bucket}/${file}`;
  }
}
