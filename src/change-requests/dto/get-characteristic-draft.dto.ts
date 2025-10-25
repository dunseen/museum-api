import { ApiProperty } from '@nestjs/swagger';
import { GetCharacteristicTypeDto } from '../../characteristic-types/dto/get-characteristic-type.dto';

export class GetCharacteristicDraftDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: GetCharacteristicTypeDto })
  type: GetCharacteristicTypeDto;
}
