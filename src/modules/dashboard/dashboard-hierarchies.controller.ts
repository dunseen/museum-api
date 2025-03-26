import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateHierarchyDto } from '../../hierarchies/application/dto/create-hierarchy.dto';
import { ListHierarchyDto } from '../../hierarchies/application/dto/list-hiearchy.dto';
import { UpdateHierarchyDto } from '../../hierarchies/application/dto/update-hierarchy.dto';
import { ListHierarchyUseCase } from '../../hierarchies/application/use-cases/list-hierarchy.use-case';
import { HierarchiesService } from '../../hierarchies/hierarchies.service';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';

@ApiTags('Dashboard - Hierarchies')
@Controller({
  path: 'dashboard/hierarchies',
  version: '1',
})
export class DashboardHierarchiesController {
  constructor(
    private readonly hierarchiesService: HierarchiesService,
    private readonly listHierarchyUseCase: ListHierarchyUseCase,
  ) {}

  @Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ListHierarchyDto,
  })
  create(@Body() createHierarchyDto: CreateHierarchyDto) {
    return this.hierarchiesService.create(createHierarchyDto);
  }

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

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: ListHierarchyDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateHierarchyDto: UpdateHierarchyDto,
  ) {
    return this.hierarchiesService.update(id, updateHierarchyDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.hierarchiesService.remove(id);
  }
}
