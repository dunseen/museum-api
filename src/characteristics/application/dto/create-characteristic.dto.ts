import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { lowerCaseTransformer } from '../../../utils/transformers/lower-case.transformer';

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
  typeId: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'The file associated with the characteristic',
  })
  file: any;
}
