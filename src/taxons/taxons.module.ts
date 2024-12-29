import { Module } from '@nestjs/common';
import { TaxonsService } from './taxons.service';
import { TaxonsController } from './taxons.controller';
import { RelationalTaxonPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalTaxonPersistenceModule],
  controllers: [TaxonsController],
  providers: [TaxonsService],
  exports: [TaxonsService, RelationalTaxonPersistenceModule],
})
export class TaxonsModule {}
