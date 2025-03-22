import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateCharacteristicDto } from '../../characteristics/application/dto/create-characteristic.dto';
import { FindAllCharacteristicsDto } from '../../characteristics/application/dto/find-all-characteristics.dto';
import { GetCharacteristicDto } from '../../characteristics/application/dto/get-characteristic.dto';
import { UpdateCharacteristicDto } from '../../characteristics/application/dto/update-characteristic.dto';
import { CharacteristicsService } from '../../characteristics/characteristics.service';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Dashboard - Characteristics')
@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.editor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'dashboard/characteristics',
  version: '1',
})
export class DashboardCharacteristicsController {
  constructor(
    private readonly characteristicsService: CharacteristicsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: GetCharacteristicDto,
  })
  @UseInterceptors(FilesInterceptor('file'))
  create(
    @UploadedFiles() file: Express.MulterS3.File[],
    @Body() createCharacteristicDto: CreateCharacteristicDto,
  ) {
    return this.characteristicsService.create(createCharacteristicDto, file);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(GetCharacteristicDto),
  })
  async findAll(
    @Query() query: FindAllCharacteristicsDto,
  ): Promise<InfinityPaginationResponseDto<GetCharacteristicDto>> {
    const page = query?.page;
    const limit = query?.limit;

    const response = await this.characteristicsService.findAllWithPagination({
      paginationOptions: {
        page,
        limit,
        filters: {
          name: query?.name,
          description: query?.description,
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
    type: GetCharacteristicDto,
  })
  findOne(@Param('id') id: number) {
    return this.characteristicsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: GetCharacteristicDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    return this.characteristicsService.update(id, updateCharacteristicDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.characteristicsService.remove(id);
  }
}
