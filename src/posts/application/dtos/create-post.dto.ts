import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: Number,
  })
  @IsInt()
  specieId: number;
}
