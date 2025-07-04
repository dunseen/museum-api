import { Module } from '@nestjs/common';
import { ChangeLogsService } from './change-logs.service';
import { RelationalChangeLogPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalChangeLogPersistenceModule],
  providers: [ChangeLogsService],
  exports: [ChangeLogsService, RelationalChangeLogPersistenceModule],
})
export class ChangeLogsModule {}
