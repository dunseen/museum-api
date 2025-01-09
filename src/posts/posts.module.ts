import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { RelationalPostPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalUserPersistenceModule } from '../users/infrastructure/persistence/relational/relational-persistence.module';
import { SpeciesModule } from '../species/species.module';

@Module({
  imports: [
    RelationalPostPersistenceModule,
    RelationalUserPersistenceModule,
    SpeciesModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, RelationalPostPersistenceModule],
})
export class PostsModule {}
