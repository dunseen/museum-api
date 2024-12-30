// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateCharacteristicTypeDto } from './create-characteristic-type.dto';

export class UpdateCharacteristicTypeDto extends PartialType(
  CreateCharacteristicTypeDto,
) {}
