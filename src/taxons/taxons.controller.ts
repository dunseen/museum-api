import { Controller, Get, Param, Query } from '@nestjs/common';
import { TaxonsService } from './taxons.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Taxon } from './domain/taxon';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTaxonsDto } from './dto/find-all-taxons.dto';
import { GetTaxonDto } from './dto/get-taxon.dto';

@ApiTags('Taxons')
@Controller({
  path: 'taxons',
  version: '1',
})
export class TaxonsController {
  constructor(private readonly taxonsService: TaxonsService) {}

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(GetTaxonDto),
  })
  async findAll(
    @Query() query: FindAllTaxonsDto,
  ): Promise<InfinityPaginationResponseDto<GetTaxonDto>> {
    const page = query?.page;
    const limit = query?.limit;

    return infinityPagination(
      await this.taxonsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Taxon,
  })
  findOne(@Param('id') id: string) {
    return this.taxonsService.findOne(Number(id));
  }
}
