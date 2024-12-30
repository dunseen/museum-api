import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class CreateCharacteristicTypeDto {
  @ApiProperty({
    type: String,
  })
  @Transform(lowerCaseTransformer)
  @IsString()
  name: string;
}
