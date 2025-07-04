import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
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
import { JwtPayload } from '../../auth/strategies/jwt.decorator';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

@ApiTags('Dashboard - Taxons')
@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.operator)
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
  create(
    @Body() createTaxonDto: CreateTaxonDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.taxonsService.create(createTaxonDto, payload);
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
            hierarchyId: query?.hierarchyId,
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

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Taxon,
  })
  update(
    @Param('id') id: string,
    @Body() updateTaxonDto: UpdateTaxonDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.taxonsService.update(Number(id), updateTaxonDto, payload);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string, @JwtPayload() payload: JwtPayloadType) {
    return this.taxonsService.remove(Number(id), payload);
  }
}
