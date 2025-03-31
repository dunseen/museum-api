import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../../files/domain/file';
import { GetCharacteristicTypeDto } from '../../../characteristic-types/dto/get-characteristic-type.dto';

export class GetCharacteristicDto {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: GetCharacteristicTypeDto,
  })
  type: GetCharacteristicTypeDto;

  @ApiProperty({
    type: FileType,
    isArray: true,
  })
  files: FileType[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
