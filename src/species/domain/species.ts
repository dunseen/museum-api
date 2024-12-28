import { ApiProperty } from '@nestjs/swagger';

export class Species {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  scientificName: string;

  @ApiProperty({
    type: String,
  })
  commonName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
