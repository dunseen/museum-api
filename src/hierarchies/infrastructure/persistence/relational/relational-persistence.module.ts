import { Module } from '@nestjs/common';
import { HierarchyRepository } from '../hierarchy.repository';
import { HierarchyRelationalRepository } from './repositories/hierarchy.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HierarchyEntity } from './entities/hierarchy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HierarchyEntity])],
  providers: [
    {
      provide: HierarchyRepository,
      useClass: HierarchyRelationalRepository,
    },
  ],
  exports: [HierarchyRepository],
})
export class RelationalHierarchyPersistenceModule {}
