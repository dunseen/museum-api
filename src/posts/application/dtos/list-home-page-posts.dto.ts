import { ApiProperty } from '@nestjs/swagger';
import { ListHomePageSpeciesDto } from '../../../species/dto/list-home-page-species.dto';

export class ListHomePagePostsDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: ListHomePageSpeciesDto,
  })
  specie: ListHomePageSpeciesDto;
}
