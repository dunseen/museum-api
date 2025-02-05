import { ApiProperty } from '@nestjs/swagger';

export class ListHierarchyDto {
  @ApiProperty({
    type: String,
  })
  id: string | number;

  @ApiProperty({
    type: String,
  })
  name: string;
}
