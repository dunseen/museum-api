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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';
import { FindAllSpeciesDto } from '../../species/dto/find-all-species.dto';
import { GetSpecieDto } from '../../species/dto/get-all-species.dto';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { CreateSpecieDto } from '../../species/dto/create-specie.dto';
import { UpdateSpecieDto } from '../../species/dto/update-specie.dto';
import { SpeciesService } from '../../species/species.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtPayload } from '../../auth/strategies/jwt.decorator';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

@ApiTags('Dashboard - Species')
@Controller({
  path: 'dashboard/species',
  version: '1',
})
export class DashboardSpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @ApiCreatedResponse({
    type: GetSpecieDto,
  })
  @UseInterceptors(FilesInterceptor('file'))
  create(
    @UploadedFiles() file: Express.MulterS3.File[],
    @Body() createSpecieDto: CreateSpecieDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.speciesService.create(createSpecieDto, file, payload);
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
