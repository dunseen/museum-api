import { Module } from '@nestjs/common';
import { RelationalFilePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesService } from './files.service';

import { FileMinioModule } from './infrastructure/uploader/minio/files.module';

const infrastructurePersistenceModule = RelationalFilePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FileMinioModule],
  providers: [FilesService],
  exports: [FilesService, infrastructurePersistenceModule],
})
export class FilesModule {}
