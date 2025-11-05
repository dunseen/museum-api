import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CharacteristicTypesService } from './characteristic-types.service';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from 'src/utils/dto/infinity-pagination-response.dto';
import { GetCharacteristicTypeDto } from './dto/get-characteristic-type.dto';
import { FindAllCharacteristicTypesDto } from './dto/find-all-characteristic-types.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiTags('Characteristictypes')
@Controller({
  path: 'characteristic-types',
  version: '1',
})
export class CharacteristicTypesController {
  constructor(
    private readonly characteristicTypesService: CharacteristicTypesService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(GetCharacteristicTypeDto),
  })
  async findAll(
    @Query() query: FindAllCharacteristicTypesDto,
  ): Promise<InfinityPaginationResponseDto<GetCharacteristicTypeDto>> {
    const page = query?.page;
    const limit = query?.limit;

    return infinityPagination(
      await this.characteristicTypesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
          filters: {
            name: query?.name,
          },
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: GetCharacteristicTypeDto,
  })
  findOne(@Param('id') id: number) {
    return this.characteristicTypesService.findOne(id);
  }
}
