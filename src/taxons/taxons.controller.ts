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
import { TaxonsService } from './taxons.service';
import { CreateTaxonDto } from './dto/create-taxon.dto';
import { UpdateTaxonDto } from './dto/update-taxon.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Taxon } from './domain/taxon';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTaxonsDto } from './dto/find-all-taxons.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Taxons')
@Controller({
  path: 'taxons',
  version: '1',
})
export class TaxonsController {
  constructor(private readonly taxonsService: TaxonsService) {}

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Post()
  @ApiCreatedResponse({
    type: Taxon,
  })
  create(@Body() createTaxonDto: CreateTaxonDto) {
    return this.taxonsService.create(createTaxonDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Taxon),
  })
  async findAll(
    @Query() query: FindAllTaxonsDto,
  ): Promise<InfinityPaginationResponseDto<Taxon>> {
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
    return this.taxonsService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
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
    return this.taxonsService.update(id, updateTaxonDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.taxonsService.remove(id);
  }
}
