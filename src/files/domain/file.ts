import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class FileType {
  @ApiProperty({
    type: String,
    example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
  })
  @Allow()
  id: string;

  @ApiProperty({
    type: String,
    example: 'file.jpg',
  })
  path: string;
  @ApiProperty({
    type: String,
    example: 'https://example.com/path/to/file.jpg',
  })
  url: string;
  specieId?: number | null;
  characteristicId?: number | null;
  changeRequestId?: number | null;
  approved?: boolean;
}
