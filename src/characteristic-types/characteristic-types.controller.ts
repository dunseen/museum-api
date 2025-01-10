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
import { CharacteristicTypesService } from './characteristic-types.service';
import { CreateCharacteristicTypeDto } from './dto/create-characteristic-type.dto';
import { UpdateCharacteristicTypeDto } from './dto/update-characteristic-type.dto';
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
import { FindAllCharacteristicTypesDto } from './dto/find-all-characteristic-types.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { GetCharacteristicTypeDto } from './dto/get-characteristic-type.dto';

@ApiTags('Characteristictypes')
@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.editor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'characteristic-types',
  version: '1',
})
export class CharacteristicTypesController {
  constructor(
    private readonly characteristicTypesService: CharacteristicTypesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: GetCharacteristicTypeDto,
  })
  create(@Body() createCharacteristicTypeDto: CreateCharacteristicTypeDto) {
    return this.characteristicTypesService.create(createCharacteristicTypeDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(GetCharacteristicTypeDto),
  })
  async findAll(
    @Query() query: FindAllCharacteristicTypesDto,
  ): Promise<InfinityPaginationResponseDto<GetCharacteristicTypeDto>> {
    const page = query?.page;
    const limit = query?.limit;

    return infinityPagination(
      await this.characteristicTypesService.findAllWithPagination({
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
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: GetCharacteristicTypeDto,
  })
  findOne(@Param('id') id: number) {
    return this.characteristicTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: GetCharacteristicTypeDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateCharacteristicTypeDto: UpdateCharacteristicTypeDto,
  ) {
    return this.characteristicTypesService.update(
      id,
      updateCharacteristicTypeDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.characteristicTypesService.remove(id);
  }
}
