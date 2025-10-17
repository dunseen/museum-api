import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './domain/post.service';
import { RelationalPostPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalUserPersistenceModule } from '../users/infrastructure/persistence/relational/relational-persistence.module';
import { SpeciesModule } from '../species/species.module';
import { FindPostByIdUseCase } from './application/use-cases/find-post-by-id.use-case';
import { ListPaginatedPostUseCase } from './application/use-cases/list-paginated-post.use-case';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { ListHomePagePostsUseCase } from './application/use-cases/list-home-page-posts.use-case';
import { FindHomePostDetailsByNameUseCase } from './application/use-cases/find-home-post-details-by-name.use-case';
import { ChangeLogsModule } from 'src/change-logs/change-logs.module';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';

const providers = [
  FindPostByIdUseCase,
  ListPaginatedPostUseCase,
  DeletePostUseCase,
  ListHomePagePostsUseCase,
  FindHomePostDetailsByNameUseCase,
  PostService,
];
@Module({
  imports: [
    RelationalPostPersistenceModule,
    RelationalUserPersistenceModule,
    UsersModule,
    forwardRef(() => SpeciesModule),
    ChangeLogsModule,
  ],
  controllers: [PostsController],
  providers,
  exports: [...providers, RelationalPostPersistenceModule],
})
export class PostsModule {}
