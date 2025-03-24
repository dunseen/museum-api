import { Module } from '@nestjs/common';
import { HierarchiesService } from './hierarchies.service';
import { HierarchiesController } from './hierarchies.controller';
import { RelationalHierarchyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ListHierarchyUseCase } from './application/use-cases/list-hierarchy.use-case';

@Module({
  imports: [RelationalHierarchyPersistenceModule],
  controllers: [HierarchiesController],
  providers: [HierarchiesService, ListHierarchyUseCase],
  exports: [
    HierarchiesService,
    RelationalHierarchyPersistenceModule,
    ListHierarchyUseCase,
  ],
})
export class HierarchiesModule {}
