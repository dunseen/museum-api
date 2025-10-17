import { Module } from '@nestjs/common';
import { RelationalChangeRequestPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ChangeRequestsService } from './change-requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecieEntity } from '../species/infrastructure/persistence/relational/entities/specie.entity';
import { FileEntity } from '../files/infrastructure/persistence/relational/entities/file.entity';
import { RelationalSpeciePersistenceModule } from '../species/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalTaxonPersistenceModule } from '../taxons/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCharacteristicPersistenceModule } from '../characteristics/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalCityPersistenceModule } from '../cities/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalStatePersistenceModule } from '../states/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalSpecialistPersistenceModule } from '../specialists/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalFilePersistenceModule } from '../files/infrastructure/persistence/relational/relational-persistence.module';
import { PostsModule } from '../posts/posts.module';
import { FileMinioModule } from '../files/infrastructure/uploader/minio/files.module';

@Module({
  imports: [
    RelationalChangeRequestPersistenceModule,
    FileMinioModule,
    // Domain repositories from other bounded contexts
    RelationalSpeciePersistenceModule,
    RelationalTaxonPersistenceModule,
    RelationalCharacteristicPersistenceModule,
    RelationalCityPersistenceModule,
    RelationalStatePersistenceModule,
    RelationalSpecialistPersistenceModule,
    RelationalFilePersistenceModule,
    PostsModule,
    // Local entities used within approval workflow
    TypeOrmModule.forFeature([SpecieEntity, FileEntity]),
  ],
  providers: [ChangeRequestsService],
  exports: [RelationalChangeRequestPersistenceModule, ChangeRequestsService],
})
export class ChangeRequestsModule {}
