import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../roles/roles.guard';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { ChangeRequestsService } from '../../change-requests/change-requests.service';
import { CreateSpecieDto } from '../../species/dto/create-specie.dto';
import { UpdateSpecieDto } from '../../species/dto/update-specie.dto';
import { ProposeCharacteristicUpdateDto } from '../../change-requests/dto/propose-characteristic-update.dto';
import { CharacteristicOperationResultDto } from '../../change-requests/dto/characteristic-operation-result.dto';
import { UpdateTaxonDto } from '../../taxons/dto/update-taxon.dto';
import { TaxonOperationResultDto } from '../../change-requests/dto/taxon-operation-result.dto';
import { JwtPayload } from '../../auth/strategies/jwt.decorator';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';
import { ChangeRequest } from '../../change-requests/domain/change-request';
import { ListChangeRequestDto } from '../../change-requests/dto/draft-with-change-request.dto';
import { FindAllChangeRequestsDto } from '../../change-requests/dto/find-all-change-requests.dto';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Dashboard - Change Requests')
@Controller({
  path: 'dashboard/change-requests',
  version: '1',
})
@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.operator)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DashboardChangeRequestsController {
  constructor(private readonly service: ChangeRequestsService) {}

  @Post('species')
  @ApiOkResponse({ type: ChangeRequest })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  proposeSpecieCreate(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateSpecieDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.service.proposeSpecieCreate(dto, files, payload.id);
  }

  @Put('species/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ChangeRequest })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  proposeSpecieUpdate(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateSpecieDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.service.proposeSpecieUpdate(Number(id), dto, files, payload.id);
  }

  @Patch('species/remove/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse()
  proposeSpecieRemove(
    @Param('id') id: number,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.service.proposeSpecieDelete(Number(id), payload.id);
  }

  // ==================== Characteristics ====================

  @Put('characteristics/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: CharacteristicOperationResultDto,
    description:
      'Update characteristic. If used by species, creates change request. Otherwise updates directly.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  updateCharacteristic(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: ProposeCharacteristicUpdateDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.service.updateCharacteristic(
      Number(id),
      dto,
      files,
      payload.id,
    );
  }

  @Delete('characteristics/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: CharacteristicOperationResultDto,
    description:
      'Delete characteristic. If used by species, creates change request. Otherwise deletes directly.',
  })
  deleteCharacteristic(
    @Param('id') id: number,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.service.deleteCharacteristic(Number(id), payload.id);
  }

  // ==================== Taxons ====================

  @Put('taxons/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: TaxonOperationResultDto,
    description:
      'Update taxon. If linked to species, creates change request. Otherwise updates directly.',
  })
  updateTaxon(
    @Param('id') id: number,
    @Body() dto: UpdateTaxonDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.service.updateTaxon(Number(id), dto, payload.id);
  }

  @Delete('taxons/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: TaxonOperationResultDto,
    description:
      'Delete taxon. If linked to species, creates change request. Otherwise deletes directly.',
  })
  deleteTaxon(@Param('id') id: number, @JwtPayload() payload: JwtPayloadType) {
    return this.service.deleteTaxon(Number(id), payload.id);
  }

  // ==================== General ====================

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ListChangeRequestDto),
  })
  async listChangeRequests(
    @Query() query: FindAllChangeRequestsDto,
  ): Promise<InfinityPaginationResponseDto<ListChangeRequestDto>> {
    const page = query?.page;
    const limit = query?.limit;
    const result = await this.service.listPaginatedChangeRequests({
      paginationOptions: { page, limit },
      status: query.status,
      action: query.action,
      entityType: query.entityType,
      search: query.search,
    });
    return infinityPagination(result, { page, limit });
  }

  @Get('/:entityType/:id')
  @ApiParam({ name: 'entityType', type: String })
  @ApiParam({ name: 'id', type: Number })
  async getDraftDetail(
    @Param('entityType') entityType: string,
    @Param('id') id: number,
  ) {
    return this.service.getDraftDetail(Number(id), entityType);
  }

  @Patch(':id/approve')
  @ApiParam({ name: 'id', type: Number })
  approve(@Param('id') id: number, @JwtPayload() payload: JwtPayloadType) {
    return this.service.approve(Number(id), payload);
  }

  @Patch(':id/reject')
  @ApiParam({ name: 'id', type: Number })
  reject(
    @Param('id') id: number,
    @JwtPayload() payload: JwtPayloadType,
    @Body('reviewerNote') reviewerNote?: string,
  ) {
    return this.service.reject(Number(id), payload.id, reviewerNote);
  }
}
