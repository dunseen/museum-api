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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { JwtPayload } from '../auth/strategies/jwt.decorator';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { ValidatePostUseCase } from './application/use-cases/validate-post.use-case';
import { ListPaginatedPostUseCase } from './application/use-cases/list-paginated-post.use-case';
import { FindPostByIdUseCase } from './application/use-cases/find-post-by-id.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import {
  CreatePostDto,
  FindAllPostsDto,
  GetPostDto,
  UpdatePostDto,
} from './application/dtos';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly validatePostUseCase: ValidatePostUseCase,
    private readonly listPaginatedPostUseCase: ListPaginatedPostUseCase,
    private readonly findPostByIdUseCase: FindPostByIdUseCase,

    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @ApiCreatedResponse({
    type: GetPostDto,
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.createPostUseCase.execute(createPostDto, payload);
  }

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

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/validate')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiNoContentResponse()
  validate(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.validatePostUseCase.execute(id, updatePostDto, payload);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }
}
