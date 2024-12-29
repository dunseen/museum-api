import { Module } from '@nestjs/common';
import { TaxonRepository } from '../taxon.repository';
import { TaxonRelationalRepository } from './repositories/taxon.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxonEntity } from './entities/taxon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxonEntity])],
  providers: [
    {
      provide: TaxonRepository,
      useClass: TaxonRelationalRepository,
    },
  ],
  exports: [TaxonRepository],
})
export class RelationalTaxonPersistenceModule {}
