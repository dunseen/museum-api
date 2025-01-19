import { ApiProperty } from '@nestjs/swagger';

export class CreateHierarchyDto {
  @ApiProperty({
    type: String,
  })
  name: string;
}
