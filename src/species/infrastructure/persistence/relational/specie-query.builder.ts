import { SelectQueryBuilder } from 'typeorm';
import { SpecieEntity } from './entities/specie.entity';

export class SpecieQueryBuilder {
  private query: SelectQueryBuilder<SpecieEntity>;

  constructor(query: SelectQueryBuilder<SpecieEntity>) {
    this.query = query;
  }
}
