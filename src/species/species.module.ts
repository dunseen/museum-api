import { forwardRef, Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { RelationalSpeciePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicPersistenceModule } from '../characteristics/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalTaxonPersistenceModule } from '../taxons/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalFilePersistenceModule } from '../files/infrastructure/persistence/relational/relational-persistence.module';
import { FileMinioModule } from '../files/infrastructure/uploader/minio/files.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    RelationalSpeciePersistenceModule,
    RelationalCharacteristicPersistenceModule,
    RelationalTaxonPersistenceModule,
    RelationalFilePersistenceModule,
    FileMinioModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [],
  providers: [SpeciesService],
  exports: [SpeciesService, RelationalSpeciePersistenceModule],
})
export class SpeciesModule {}
