import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListDashboardSummaryUseCase } from './application/use-cases/list-summary.use-case';
import { ListSummaryCountsDto } from './application/dtos/list-summary-counts.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Dashboard - Summary')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'dashboard/summary',
  version: '1',
})
export class DashboardSummaryController {
  constructor(
    private readonly listSummaryCountUseCase: ListDashboardSummaryUseCase,
  ) {}

  @Get('counts')
  @ApiOkResponse({
    type: ListSummaryCountsDto,
  })
  async findAll(): Promise<ListSummaryCountsDto> {
    return this.listSummaryCountUseCase.execute();
  }
}
