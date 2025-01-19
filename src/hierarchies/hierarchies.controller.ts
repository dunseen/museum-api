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
import { HierarchiesService } from './hierarchies.service';
import { CreateHierarchyDto } from './application/dto/create-hierarchy.dto';
import { UpdateHierarchyDto } from './application/dto/update-hierarchy.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
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

  @Roles(RoleEnum.admin, RoleEnum.editor)
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
