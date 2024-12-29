import { Module } from '@nestjs/common';
import { HierarchiesService } from './hierarchies.service';
import { HierarchiesController } from './hierarchies.controller';
import { RelationalHierarchyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalHierarchyPersistenceModule],
  controllers: [HierarchiesController],
  providers: [HierarchiesService],
  exports: [HierarchiesService, RelationalHierarchyPersistenceModule],
})
export class HierarchiesModule {}
