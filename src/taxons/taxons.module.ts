import { Module } from '@nestjs/common';
import { TaxonsService } from './taxons.service';
import { TaxonsController } from './taxons.controller';
import { RelationalTaxonPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalHierarchyPersistenceModule } from '../hierarchies/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicPersistenceModule } from '../characteristics/infrastructure/persistence/relational/relational-persistence.module';
import { ChangeLogsModule } from '../change-logs/change-logs.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    RelationalTaxonPersistenceModule,
    RelationalHierarchyPersistenceModule,
    RelationalCharacteristicPersistenceModule,
    UsersModule,
    ChangeLogsModule,
  ],
  controllers: [TaxonsController],
  providers: [TaxonsService],
  exports: [TaxonsService, RelationalTaxonPersistenceModule],
})
export class TaxonsModule {}
