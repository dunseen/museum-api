import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UploadDto {
  @ApiProperty({
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  specieId?: number;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  characteristicId?: number;
}
