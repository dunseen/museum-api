import { Controller, Get, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { City } from './domain/city';
import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { FindAllCitiesDto } from './dto/find-all-cities.dto';

@ApiTags('Cities')
@Controller({
  path: 'cities',
  version: '1',
})
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(City),
  })
  async findAll(@Query() query: FindAllCitiesDto): Promise<City[]> {
    return this.citiesService.findAll(query?.stateId);
  }
}
