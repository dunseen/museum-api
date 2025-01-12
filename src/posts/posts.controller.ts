import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { FindAllPostsDto, ListHomePagePostsDto } from './application/dtos';
import { ListHomePagePostsUseCase } from './application/use-cases/list-home-page-posts.use-case';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(
    private readonly listHomePagePostsUseCase: ListHomePagePostsUseCase,
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
      },
    });
  }
  // @Get(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: GetPostDto,
  // })
  // findOne(@Param('id') id: string) {
  //   return this.findPostByIdUseCase.execute(id);
  // }
}
