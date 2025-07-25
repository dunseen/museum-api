// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSpecialistDto } from './create-specialist.dto';

export class UpdateSpecialistDto extends PartialType(CreateSpecialistDto) {}
