import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { Repository } from 'typeorm';
import { FileRepository } from '../../file.repository';

import { FileMapper } from '../mappers/file.mapper';
import { FileType } from '../../../../domain/file';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SpecieEntity } from 'src/species/infrastructure/persistence/relational/entities/specie.entity';

@Injectable()
export class FileRelationalRepository implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: FileType[]): Promise<FileType[]> {
    const persistenceModel = data.map(FileMapper.toPersistence);

    return this.fileRepository.save(persistenceModel);
  }

  async findById(id: FileType['id']): Promise<NullableType<FileType>> {
    const entity = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }

  async delete(ids: FileType['id'][]): Promise<void> {
    await this.fileRepository.softDelete(ids);
  }

  async approveByChangeRequest(
    changeRequestId: number,
    opts?: { specieId?: number },
  ): Promise<void> {
    if (opts?.specieId) {
      await this.fileRepository
        .createQueryBuilder()
        .update()
        .set({ approved: true, specie: { id: opts.specieId } })
        .where('"changeRequestId" = :crId', { crId: changeRequestId })
        .execute();
      return;
    }

    await this.fileRepository
      .createQueryBuilder()
      .update()
      .set({ approved: true })
      .where('"changeRequestId" = :crId', { crId: changeRequestId })
      .execute();
  }

  async approveByCharacteristicIds(characteristicIds: number[]): Promise<void> {
    if (!characteristicIds.length) return;

    await this.fileRepository
      .createQueryBuilder()
      .update()
      .set({ approved: true })
      .where('"characteristicId" IN (:...ids)', { ids: characteristicIds })
      .andWhere('approved = :approved', { approved: false })
      .execute();
  }

  async findIdsByChangeRequest(changeRequestId: number): Promise<string[]> {
    const rows = await this.fileRepository.find({
      where: { changeRequest: { id: changeRequestId } },
      select: ['id'],
    });
    return rows.map((r) => r.id);
  }

  async findIdsBySpecie(specieId: number, ids: string[]): Promise<string[]> {
    if (!ids.length) return [];
    const rows = await this.fileRepository
      .createQueryBuilder('f')
      .select('f.id', 'id')
      .where('f.id IN (:...ids)', { ids })
      .andWhere('f."specieId" = :specieId', { specieId })
      .getRawMany<{ id: string }>();
    return rows.map((r) => r.id);
  }

  async findByChangeRequest(changeRequestId: number): Promise<FileType[]> {
    const rows = await this.fileRepository.find({
      where: { changeRequest: { id: changeRequestId } },
      select: ['id', 'path', 'url', 'approved'],
    });
    return rows.map(FileMapper.toDomain);
  }

  async updateMany(
    updates: Array<{
      id: string;
      path?: string;
      url?: string;
      specieId?: number;
      approved?: boolean;
      clearChangeRequest?: boolean;
    }>,
  ): Promise<void> {
    for (const u of updates) {
      const payload: any = {};
      if (u.path !== undefined) payload.path = u.path;
      if (u.url !== undefined) payload.url = u.url;
      if (u.approved !== undefined) payload.approved = u.approved;
      if (u.specieId !== undefined) {
        const specie = new SpecieEntity();
        specie.id = u.specieId;
        payload.specie = specie;
      }

      if (u.clearChangeRequest) payload.changeRequest = null;
      await this.fileRepository.update({ id: u.id }, payload);
    }
  }
}
