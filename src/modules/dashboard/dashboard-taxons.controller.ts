import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';
import { Taxon } from '../../taxons/domain/taxon';
import { CreateTaxonDto } from '../../taxons/dto/create-taxon.dto';
import { FindAllTaxonsDto } from '../../taxons/dto/find-all-taxons.dto';
import { UpdateTaxonDto } from '../../taxons/dto/update-taxon.dto';
import { TaxonsService } from '../../taxons/taxons.service';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { GetTaxonDto } from '../../taxons/dto/get-taxon.dto';

@ApiTags('Dashboard - Taxons')
@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.editor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'dashboard/taxons',
  version: '1',
})
export class DashboardTaxonsController {
  constructor(private readonly taxonsService: TaxonsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Taxon,
  })
  create(@Body() createTaxonDto: CreateTaxonDto) {
    return this.taxonsService.create(createTaxonDto);
  }

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
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Taxon,
  })
  findOne(@Param('id') id: string) {
    return this.taxonsService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Taxon,
  })
  update(@Param('id') id: string, @Body() updateTaxonDto: UpdateTaxonDto) {
    return this.taxonsService.update(Number(id), updateTaxonDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.taxonsService.remove(Number(id));
  }
}
