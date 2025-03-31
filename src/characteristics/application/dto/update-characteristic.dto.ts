import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCharacteristicDto } from './create-characteristic.dto';
import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateCharacteristicDto extends PartialType(
  CreateCharacteristicDto,
) {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    description:
      'The files UUID associated with the characteristic separated by commas',
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => value.split(','))
  filesToDelete?: string[];
}
