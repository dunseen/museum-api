import { NullableType } from '../../../utils/types/nullable.type';
import { FileType } from '../../domain/file';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id'>[]): Promise<FileType[]>;

  abstract findById(id: FileType['id']): Promise<NullableType<FileType>>;

  abstract delete(id: FileType['id'][]): Promise<void>;

  abstract approveByChangeRequest(
    changeRequestId: number,
    opts?: { specieId?: number },
  ): Promise<void>;

  abstract approveByCharacteristicIds(
    characteristicIds: number[],
  ): Promise<void>;

  abstract findIdsByChangeRequest(changeRequestId: number): Promise<string[]>;

  abstract findIdsBySpecie(specieId: number, ids: string[]): Promise<string[]>;

  abstract findByChangeRequest(changeRequestId: number): Promise<FileType[]>;

  abstract updateMany(
    updates: Array<{
      id: string;
      path?: string;
      url?: string;
      specieId?: number;
      approved?: boolean;
      clearChangeRequest?: boolean;
    }>,
  ): Promise<void>;
}
