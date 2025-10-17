import { ApiProperty } from '@nestjs/swagger';
import { GetSpecieDto } from '../../../species/dto/get-all-species.dto';

export class GetPostDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: GetSpecieDto,
  })
  specie: GetSpecieDto;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
