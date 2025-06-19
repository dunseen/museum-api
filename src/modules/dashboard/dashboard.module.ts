import { Module } from '@nestjs/common';
import { DashboardPostsController } from './dashboard-posts.controller';
import { PostsModule } from '../../posts/posts.module';
import { CharacteristicsModule } from '../../characteristics/characteristics.module';
import { DashboardCharacteristicsController } from './dashboard-characteristics.controller';
import { DashboardSummaryController } from './dashboard-summary.controller';
import { TaxonsModule } from '../../taxons/taxons.module';
import { ListDashboardSummaryUseCase } from './application/use-cases/list-summary.use-case';
import { SpeciesModule } from '../../species/species.module';
import { DashboardCharacteristicTypesController } from './dashboard-characteristic-types.controller';
import { CharacteristicTypesModule } from '../../characteristic-types/characteristic-types.module';
import { FileMinioModule } from '../../files/infrastructure/uploader/minio/files.module';

import { DashboardSpeciesController } from './dashboard-species.controller';
import { DashboardTaxonsController } from './dashboard-taxons.controller';
import { DashboardHierarchiesController } from './dashboard-hierarchies.controller';
import { HierarchiesModule } from '../../hierarchies/hierarchies.module';
import { DashboardUsersController } from './dashboard-users.controller';
import { UsersModule } from '../../users/users.module';
import { DashboardSpecialistsController } from './dashboard-specialists.controller';
import { SpecialistsModule } from '../../specialists/specialists.module';

@Module({
  imports: [
    PostsModule,
    CharacteristicsModule,
    CharacteristicTypesModule,
    TaxonsModule,
    HierarchiesModule,
    SpeciesModule,
    FileMinioModule,
    UsersModule,
    SpecialistsModule,
  ],
  providers: [ListDashboardSummaryUseCase],
  controllers: [
    DashboardUsersController,
    DashboardPostsController,
    DashboardCharacteristicsController,
    DashboardCharacteristicTypesController,
    DashboardTaxonsController,
    DashboardHierarchiesController,
    DashboardSpeciesController,
    DashboardSpecialistsController,
    DashboardSummaryController,
  ],
})
export class DashboardModule {}
