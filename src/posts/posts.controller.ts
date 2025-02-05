import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import {
  FindAllPostsDto,
  GetPostDto,
  ListHomePagePostsDto,
} from './application/dtos';
import { ListHomePagePostsUseCase } from './application/use-cases/list-home-page-posts.use-case';
import { FindHomePostDetailsByNameUseCase } from './application/use-cases/find-home-post-details-by-name.use-case';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(
    private readonly listHomePagePostsUseCase: ListHomePagePostsUseCase,
    private readonly findHomePostDetailsByNameUseCase: FindHomePostDetailsByNameUseCase,
  ) {}

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ListHomePagePostsDto),
  })
  findAll(
    @Query() query: FindAllPostsDto,
  ): Promise<InfinityPaginationResponseDto<ListHomePagePostsDto>> {
    const page = query?.page;
    const limit = query?.limit;

    return this.listHomePagePostsUseCase.execute({
      paginationOptions: {
        page,
        limit,
        filters: {
          name: query?.name,
        },
      },
    });
  }
  @Get('specie/:name')
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: 'The common name or scientific name of a specie',
  })
  @ApiOkResponse({
    type: GetPostDto,
  })
  findOne(@Param('name') name: string) {
    return this.findHomePostDetailsByNameUseCase.execute(
      decodeURIComponent(name),
    );
  }
}
