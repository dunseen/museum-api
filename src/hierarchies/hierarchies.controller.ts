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
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';

@ApiTags('Hierarchies')
@Controller({
  path: 'hierarchies',
  version: '1',
})
export class HierarchiesController {
  constructor(private readonly hierarchiesService: HierarchiesService) {}

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: Hierarchy,
  })
  create(@Body() createHierarchyDto: CreateHierarchyDto) {
    return this.hierarchiesService.create(createHierarchyDto);
  }

  @Get()
  @ApiOkResponse({
    type: Hierarchy,
    isArray: true,
  })
  findAll(): Promise<Hierarchy[]> {
    return this.hierarchiesService.findAll();
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

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @ApiBearerAuth()
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

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.hierarchiesService.remove(id);
  }
}
