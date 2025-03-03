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
import { JwtPayload } from '../../auth/strategies/jwt.decorator';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';
import {
  GetPostDto,
  CreatePostDto,
  FindAllPostsDto,
  UpdatePostDto,
} from '../../posts/application/dtos';
import { CreatePostUseCase } from '../../posts/application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../posts/application/use-cases/delete-post.use-case';
import { FindPostByIdUseCase } from '../../posts/application/use-cases/find-post-by-id.use-case';
import { ListPaginatedPostUseCase } from '../../posts/application/use-cases/list-paginated-post.use-case';
import { ValidatePostUseCase } from '../../posts/application/use-cases/validate-post.use-case';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';
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
