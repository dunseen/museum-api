import { Module } from '@nestjs/common';
import { PostRepository } from '../post.repository';
import { PostRelationalRepository } from './repositories/post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  providers: [
    {
      provide: PostRepository,
      useClass: PostRelationalRepository,
    },
  ],
  exports: [PostRepository],
})
export class RelationalPostPersistenceModule {}
