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
import { CharacteristicType } from './domain/characteristic-type';
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
    type: CharacteristicType,
  })
  create(@Body() createCharacteristicTypeDto: CreateCharacteristicTypeDto) {
    return this.characteristicTypesService.create(createCharacteristicTypeDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CharacteristicType),
  })
  async findAll(
    @Query() query: FindAllCharacteristicTypesDto,
  ): Promise<InfinityPaginationResponseDto<CharacteristicType>> {
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
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CharacteristicType,
  })
  findOne(@Param('id') id: string) {
    return this.characteristicTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CharacteristicType,
  })
  update(
    @Param('id') id: string,
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
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.characteristicTypesService.remove(id);
  }
}
