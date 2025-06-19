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
import { SpecialistsService } from '../../specialists/specialists.service';
import { CreateSpecialistDto } from '../../specialists/dto/create-specialist.dto';
import { UpdateSpecialistDto } from '../../specialists/dto/update-specialist.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Specialist } from '../../specialists/domain/specialist';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { FindAllSpecialistsDto } from '../../specialists/dto/find-all-specialists.dto';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';

@ApiTags('Dashboard - Specialists')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'dashboard/specialists',
  version: '1',
})
export class DashboardSpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.operator)
  @Post()
  @ApiCreatedResponse({
    type: Specialist,
  })
  create(@Body() createSpecialistDto: CreateSpecialistDto) {
    return this.specialistsService.create(createSpecialistDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.operator)
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Specialist),
  })
  async findAll(
    @Query() query: FindAllSpecialistsDto,
  ): Promise<InfinityPaginationResponseDto<Specialist>> {
    const page = query?.page;
    const limit = query?.limit;

    return infinityPagination(
      await this.specialistsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
          filters: {
            name: query?.name,
            specialistType: query?.type,
          },
        },
      }),
      { page, limit },
    );
  }

  @Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.operator)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Specialist,
  })
  findOne(@Param('id') id: string) {
    return this.specialistsService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Specialist,
  })
  update(
    @Param('id') id: string,
    @Body() updateSpecialistDto: UpdateSpecialistDto,
  ) {
    return this.specialistsService.update(id, updateSpecialistDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.specialistsService.remove(id);
  }
}
