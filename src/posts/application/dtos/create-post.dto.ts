import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: Number,
  })
  @IsInt()
  specieId: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the approved change request',
  })
  @IsInt()
  changeRequestId!: number;
}
