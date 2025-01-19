import { ApiProperty, PickType } from '@nestjs/swagger';
import { GetCharacteristicDto } from './get-characteristic.dto';

class SimpleCharacteristicDto extends PickType(GetCharacteristicDto, [
  'id',
  'name',
]) {}

export class ListHomeCharacteristicFiltersDto {
  @ApiProperty({
    type: String,
    description: 'Characteristic type',
  })
  type: string;

  @ApiProperty({
    type: SimpleCharacteristicDto,
    isArray: true,
  })
  characteristics: SimpleCharacteristicDto[];
}
