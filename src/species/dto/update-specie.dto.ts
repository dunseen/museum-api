import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSpecieDto } from './create-specie.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSpecieDto extends PartialType(CreateSpecieDto) {
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
