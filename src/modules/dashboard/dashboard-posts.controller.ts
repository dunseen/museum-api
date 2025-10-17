import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetPostDto, FindAllPostsDto } from '../../posts/application/dtos';
import { FindPostByIdUseCase } from '../../posts/application/use-cases/find-post-by-id.use-case';
import { ListPaginatedPostUseCase } from '../../posts/application/use-cases/list-paginated-post.use-case';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../../utils/infinity-pagination';

@ApiTags('Dashboard - Posts')
@Controller({
  path: 'dashboard/posts',
  version: '1',
})
export class DashboardPostsController {
  constructor(
    private readonly listPaginatedPostUseCase: ListPaginatedPostUseCase,
    private readonly findPostByIdUseCase: FindPostByIdUseCase,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(GetPostDto),
  })
  async findAll(
    @Query() query: FindAllPostsDto,
  ): Promise<InfinityPaginationResponseDto<GetPostDto>> {
    const page = query?.page;
    const limit = query?.limit;

    const result = await this.listPaginatedPostUseCase.execute({
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(result, { page, limit });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: GetPostDto,
  })
  findOne(@Param('id') id: string) {
    return this.findPostByIdUseCase.execute(id);
  }
}
