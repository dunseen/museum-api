// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatespeciesDto } from './create-species.dto';

export class UpdatespeciesDto extends PartialType(CreatespeciesDto) {}
