import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';

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
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
  })
  type: string;

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
