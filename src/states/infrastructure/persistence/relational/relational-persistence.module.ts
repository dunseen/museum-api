import { Module } from '@nestjs/common';
import { StateRepository } from '../state.repository';
import { StateRelationalRepository } from './repositories/state.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntity } from './entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity])],
  providers: [
    {
      provide: StateRepository,
      useClass: StateRelationalRepository,
    },
  ],
  exports: [StateRepository],
})
export class RelationalStatePersistenceModule {}
