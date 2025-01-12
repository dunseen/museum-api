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
import { SpeciesService } from './species.service';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSpeciesDto } from './dto/find-all-species.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { GetSpecieDto } from './dto/get-all-species.dto';

@ApiTags('Species')
@Controller({
  path: 'species',
  version: '1',
})
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @ApiCreatedResponse({
    type: GetSpecieDto,
  })
  create(@Body() createSpecieDto: CreateSpecieDto) {
    return this.speciesService.create(createSpecieDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(GetSpecieDto),
  })
  async findAll(
    @Query() query: FindAllSpeciesDto,
  ): Promise<InfinityPaginationResponseDto<GetSpecieDto>> {
    const page = query?.page;
    const limit = query?.limit;

    const response = await this.speciesService.findAllWithPagination({
      paginationOptions: {
        page,
        limit,
        filters: {
          name: query?.name,
        },
      },
    });

    return infinityPagination(response, { page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: GetSpecieDto,
  })
  findOne(@Param('id') id: number) {
    return this.speciesService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: GetSpecieDto,
  })
  update(@Param('id') id: number, @Body() updateSpecieDto: UpdateSpecieDto) {
    return this.speciesService.update(id, updateSpecieDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.speciesService.remove(id);
  }
}
