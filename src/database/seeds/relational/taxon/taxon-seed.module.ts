import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxonEntity } from '../../../../taxons/infrastructure/persistence/relational/entities/taxon.entity';
import { TaxonSeedService } from './taxon-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaxonEntity])],
  providers: [TaxonSeedService],
  exports: [TaxonSeedService],
})
export class TaxonSeedModule {}
