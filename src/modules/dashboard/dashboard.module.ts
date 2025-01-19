import { Module } from '@nestjs/common';
import { DashboardPostsController } from './dashboard-posts.controller';
import { PostsModule } from '../../posts/posts.module';
import { CharacteristicsModule } from '../../characteristics/characteristics.module';
import { DashboardCharacteristicsController } from './dashboard-characteristics.controller';

@Module({
  imports: [PostsModule, CharacteristicsModule],
  controllers: [DashboardPostsController, DashboardCharacteristicsController],
})
export class DashboardModule {}
