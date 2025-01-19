import { OmitType } from '@nestjs/swagger';
import { GetCharacteristicDto } from './get-characteristic.dto';

export class GetSimpleCharacteristicDto extends OmitType(GetCharacteristicDto, [
  'files',
]) {}
