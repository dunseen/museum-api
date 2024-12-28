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
import { Specie } from './domain/specie';
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
    type: Specie,
  })
  create(@Body() createSpecieDto: CreateSpecieDto) {
    return this.speciesService.create(createSpecieDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Specie),
  })
  async findAll(
    @Query() query: FindAllSpeciesDto,
  ): Promise<InfinityPaginationResponseDto<Specie>> {
    const page = query?.page;
    const limit = query?.limit;

    return infinityPagination(
      await this.speciesService.findAllWithPagination({
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
    type: Specie,
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
    type: Specie,
  })
  update(@Param('id') id: string, @Body() updateSpecieDto: UpdateSpecieDto) {
    return this.speciesService.update(id, updateSpecieDto);
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
