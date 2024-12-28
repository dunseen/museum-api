// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateSpecieDto } from './create-specie.dto';

export class UpdateSpecieDto extends PartialType(CreateSpecieDto) {}
