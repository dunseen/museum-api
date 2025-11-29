import { Module } from '@nestjs/common';
import { RelationalFilePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

import { FileMinioModule } from './infrastructure/uploader/minio/files.module';

const infrastructurePersistenceModule = RelationalFilePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FileMinioModule],
  providers: [],
  exports: [infrastructurePersistenceModule],
})
export class FilesModule {}
