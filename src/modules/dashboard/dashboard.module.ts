import { Module } from '@nestjs/common';
import { DashboardPostsController } from './dashboard-posts.controller';
import { PostsModule } from '../../posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [DashboardPostsController],
})
export class DashboardModule {}
