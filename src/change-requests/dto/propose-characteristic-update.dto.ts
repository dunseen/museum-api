import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class ProposeCharacteristicUpdateDto {
  @ApiPropertyOptional({ example: 'Updated Leaf Shape' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  typeId?: number;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  files?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of file paths to delete',
  })
  @IsArray()
  @IsOptional()
  filesToDelete?: string[];
}
