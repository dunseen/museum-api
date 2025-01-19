import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListHomeCharacteristicFiltersUseCase } from './application/use-cases/list-home-characteristic-filters.use-case';
import { ListHomeCharacteristicFiltersDto } from './application/dto/list-home-characteristic-filters.dto';

@ApiTags('Characteristics')
@Controller({
  path: 'characteristics',
  version: '1',
})
export class CharacteristicsController {
  constructor(
    private readonly listHomeCharacteristicFiltersUseCase: ListHomeCharacteristicFiltersUseCase,
  ) {}

  @Get('home/filters')
  @ApiOkResponse({
    type: ListHomeCharacteristicFiltersDto,
    isArray: true,
  })
  listHomeFilters() {
    return this.listHomeCharacteristicFiltersUseCase.execute();
  }
}
