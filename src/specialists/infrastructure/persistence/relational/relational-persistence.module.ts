import { Module } from '@nestjs/common';
import { SpecialistRepository } from '../specialist.repository';
import { SpecialistRelationalRepository } from './repositories/specialist.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistEntity } from './entities/specialist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialistEntity])],
  providers: [
    {
      provide: SpecialistRepository,
      useClass: SpecialistRelationalRepository,
    },
  ],
  exports: [SpecialistRepository],
})
export class RelationalSpecialistPersistenceModule {}
