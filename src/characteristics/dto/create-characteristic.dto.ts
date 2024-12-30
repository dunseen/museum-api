import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class CreateCharacteristicDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @Transform(lowerCaseTransformer)
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  typeId: number;
}
