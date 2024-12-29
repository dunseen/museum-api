import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateTaxonDto {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: Number,
  })
  hierarchyId: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  parentId: number | null;
}
