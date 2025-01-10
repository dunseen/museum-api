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
import { CharacteristicsService } from './characteristics.service';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCharacteristicsDto } from './dto/find-all-characteristics.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { GetCharacteristicDto } from './dto/get-characteristic.dto';

@ApiTags('Characteristics')
@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.editor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'characteristics',
  version: '1',
})
export class CharacteristicsController {
  constructor(
    private readonly characteristicsService: CharacteristicsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: GetCharacteristicDto,
  })
  create(@Body() createCharacteristicDto: CreateCharacteristicDto) {
    return this.characteristicsService.create(createCharacteristicDto);
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
