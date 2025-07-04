import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeLogEntity } from './entities/change-log.entity';
import { ChangeLogRepository } from '../../../domain/change-log.repository';
import { ChangeLogRelationalRepository } from './repositories/change-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeLogEntity])],
  providers: [
    {
      provide: ChangeLogRepository,
      useClass: ChangeLogRelationalRepository,
    },
  ],
  exports: [ChangeLogRepository],
})
export class RelationalChangeLogPersistenceModule {}
