import { Controller, Get, Param } from '@nestjs/common';
import { HierarchiesService } from './hierarchies.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ListHierarchyUseCase } from './application/use-cases/list-hierarchy.use-case';
import { ListHierarchyDto } from './application/dto/list-hiearchy.dto';

@ApiTags('Hierarchies')
@Controller({
  path: 'hierarchies',
  version: '1',
})
export class HierarchiesController {
  constructor(
    private readonly hierarchiesService: HierarchiesService,
    private readonly listHierarchyUseCase: ListHierarchyUseCase,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ListHierarchyDto,
    isArray: true,
  })
  findAll(): Promise<ListHierarchyDto[]> {
    return this.listHierarchyUseCase.execute();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: ListHierarchyDto,
  })
  findOne(@Param('id') id: number) {
    return this.hierarchiesService.findOne(id);
  }
}
