import { Controller, Get } from '@nestjs/common';
import { StatesService } from './states.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { State } from './domain/state';

@ApiTags('States')
@Controller({
  path: 'states',
  version: '1',
})
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get()
  @ApiOkResponse({
    type: State,
    isArray: true,
  })
  async findAll(): Promise<State[]> {
    return this.statesService.findAll();
  }
}
