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
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Species } from './domain/species';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSpeciesDto } from './dto/find-all-species.dto';

@ApiTags('Species')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'species',
  version: '1',
})
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Species,
  })
  create(@Body() createspeciesDto: CreateSpeciesDto) {
    return this.speciesService.create(createspeciesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Species),
  })
  async findAll(
    @Query() query: FindAllSpeciesDto,
  ): Promise<InfinityPaginationResponseDto<Species>> {
    const page = query?.page;

    const limit = query?.limit;

    return infinityPagination(
      await this.speciesService.findAllWithPagination({
        paginationOptions: {
          page: query?.page,
          limit: query?.limit,
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
    type: Species,
  })
  findOne(@Param('id') id: string) {
    return this.speciesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Species,
  })
  update(@Param('id') id: string, @Body() updatespeciesDto: UpdateSpeciesDto) {
    return this.speciesService.update(id, updatespeciesDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.speciesService.remove(id);
  }
}
