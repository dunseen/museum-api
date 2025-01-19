// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateCharacteristicDto } from './create-characteristic.dto';

export class UpdateCharacteristicDto extends PartialType(
  CreateCharacteristicDto,
) {}
