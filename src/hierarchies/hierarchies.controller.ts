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
import { HierarchiesService } from './hierarchies.service';
import { CreateHierarchyDto } from './dto/create-hierarchy.dto';
import { UpdateHierarchyDto } from './dto/update-hierarchy.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Hierarchy } from './domain/hierarchy';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllHierarchiesDto } from './dto/find-all-hierarchies.dto';

@ApiTags('Hierarchies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'hierarchies',
  version: '1',
})
export class HierarchiesController {
  constructor(private readonly hierarchiesService: HierarchiesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Hierarchy,
  })
  create(@Body() createHierarchyDto: CreateHierarchyDto) {
    return this.hierarchiesService.create(createHierarchyDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Hierarchy),
  })
  async findAll(
    @Query() query: FindAllHierarchiesDto,
  ): Promise<InfinityPaginationResponseDto<Hierarchy>> {
    const page = query?.page;
    const limit = query?.limit;

    return infinityPagination(
      await this.hierarchiesService.findAllWithPagination({
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
    type: Hierarchy,
  })
  findOne(@Param('id') id: string) {
    return this.hierarchiesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Hierarchy,
  })
  update(
    @Param('id') id: string,
    @Body() updateHierarchyDto: UpdateHierarchyDto,
  ) {
    return this.hierarchiesService.update(id, updateHierarchyDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.hierarchiesService.remove(id);
  }
}
