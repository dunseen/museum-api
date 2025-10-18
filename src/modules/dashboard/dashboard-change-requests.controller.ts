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
export class DashboardChangeRequestsController {
  constructor(private readonly service: ChangeRequestsService) {}

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor, RoleEnum.operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('species/remove/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse()
  proposeSpecieRemove(
    @Param('id') id: number,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.service.proposeSpecieDelete(Number(id), payload.id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/:entityType/:id')
  @ApiParam({ name: 'entityType', type: String })
  @ApiParam({ name: 'id', type: Number })
  async getDraftDetail(
    @Param('entityType') entityType: string,
    @Param('id') id: number,
  ) {
    return this.service.getDraftDetail(Number(id), entityType);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/approve')
  @ApiParam({ name: 'id', type: Number })
  approve(@Param('id') id: number, @JwtPayload() payload: JwtPayloadType) {
    return this.service.approve(Number(id), payload);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
