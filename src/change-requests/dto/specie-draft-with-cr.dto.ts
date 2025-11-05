import { ApiProperty } from '@nestjs/swagger';
import { SimpleChangeRequestDto } from './simple-change-request.dto';

export class SpecieDraftWithChangeReqDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  scientificName: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: SimpleChangeRequestDto })
  changeRequest: SimpleChangeRequestDto;
}
