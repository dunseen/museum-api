import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HierarchyEntity } from '../../../../hierarchies/infrastructure/persistence/relational/entities/hierarchy.entity';
import { HierarchySeedService } from './hierarchy-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([HierarchyEntity])],
  providers: [HierarchySeedService],
  exports: [HierarchySeedService],
})
export class HierarchySeedModule {}
