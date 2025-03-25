import { ApiProperty } from '@nestjs/swagger';

export class ListHierarchyDto {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;
}
