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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { JwtPayload } from '../auth/strategies/jwt.decorator';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { GetPostDto } from './dto/get-post.dto';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
    return this.postsService.create(createPostDto, payload);
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

    return infinityPagination(
      await this.postsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
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
    return this.postsService.findOne(id);
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
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @JwtPayload() payload: JwtPayloadType,
  ) {
    return this.postsService.update(id, updatePostDto, payload);
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
    return this.postsService.remove(id);
  }
}
