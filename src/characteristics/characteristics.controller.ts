import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CharacteristicsService } from './characteristics.service';
import { FindAllCharacteristicsDto } from './application/dto/find-all-characteristics.dto';
import { InfinityPaginationResponse } from 'src/utils/dto/infinity-pagination-response.dto';
import { GetCharacteristicDto } from './application/dto/get-characteristic.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiTags('Characteristics')
@Controller({
  path: 'characteristics',
  version: '1',
})
export class CharacteristicsController {
  constructor(
    private readonly characteristicsService: CharacteristicsService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(GetCharacteristicDto),
  })
  async listCharacteristics(@Query() query: FindAllCharacteristicsDto) {
    return infinityPagination(
      await this.characteristicsService.findAllWithPagination({
        paginationOptions: {
          page: query.page,
          limit: query.limit,
          filters: {
            name: query.name,
            typesId: query.characteristicTypeIds,
          },
        },
      }),
      { page: query.page, limit: query.limit },
    );
  }
}
