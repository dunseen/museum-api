import { OmitType } from '@nestjs/swagger';
import { GetSpecieDto } from './get-all-species.dto';

export class ListHomePageSpeciesDto extends OmitType(GetSpecieDto, [
  'characteristics',
  'location',
  'collectedAt',
  'determinatedAt',
  'collector',
  'determinator',
]) {}
