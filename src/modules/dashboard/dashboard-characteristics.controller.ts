import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiConsumes,
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
@Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.operator)
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createCharacteristicDto: CreateCharacteristicDto,
  ) {
    return this.characteristicsService.create(createCharacteristicDto, files);
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

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: GetCharacteristicDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    return this.characteristicsService.update(
      id,
      updateCharacteristicDto,
      files,
    );
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
