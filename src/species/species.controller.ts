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
import { speciesService } from './species.service';
import { CreatespeciesDto } from './dto/create-species.dto';
import { UpdatespeciesDto } from './dto/update-species.dto';
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
import { FindAllspeciesDto } from './dto/find-all-species.dto';

@ApiTags('Species')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'species',
  version: '1',
})
export class speciesController {
  constructor(private readonly speciesService: speciesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Species,
  })
  create(@Body() createspeciesDto: CreatespeciesDto) {
    return this.speciesService.create(createspeciesDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Species),
  })
  async findAll(
    @Query() query: FindAllspeciesDto,
  ): Promise<InfinityPaginationResponseDto<Species>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

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
  update(@Param('id') id: string, @Body() updatespeciesDto: UpdatespeciesDto) {
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
