import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GetCharacteristicTypeDto } from '../../characteristic-types/dto/get-characteristic-type.dto';
import { FileType } from '../../files/domain/file';

export class GetCharacteristicDraftDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: GetCharacteristicTypeDto })
  type: GetCharacteristicTypeDto;

  @ApiProperty({ type: FileType, isArray: true })
  files: FileType[];

  @ApiPropertyOptional({ type: Object, nullable: true })
  diff?: Record<string, any> | null;
}
