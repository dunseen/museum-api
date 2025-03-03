import { Module } from '@nestjs/common';
import { DashboardPostsController } from './dashboard-posts.controller';
import { PostsModule } from '../../posts/posts.module';
import { CharacteristicsModule } from '../../characteristics/characteristics.module';
import { DashboardCharacteristicsController } from './dashboard-characteristics.controller';
import { DashboardSummaryController } from './dashboard-summary.controller';
import { TaxonsModule } from '../../taxons/taxons.module';
import { ListDashboardSummaryUseCase } from './application/use-cases/list-summary.use-case';
import { SpeciesModule } from '../../species/species.module';

@Module({
  imports: [PostsModule, CharacteristicsModule, TaxonsModule, SpeciesModule],
  providers: [ListDashboardSummaryUseCase],
  controllers: [
    DashboardPostsController,
    DashboardCharacteristicsController,
    DashboardSummaryController,
  ],
})
export class DashboardModule {}
