import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesMinioService } from './files.service';
import { FileResponseDto } from './dto/file-response.dto';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesMinioController {
  constructor(private readonly filesService: FilesMinioService) {}

  @ApiCreatedResponse({
    type: FileResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        specieId: {
          type: 'number',
          nullable: true,
        },
        characteristicId: {
          type: 'number',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  uploadFile(
    @UploadedFiles() file: Express.MulterS3.File[],
    @Body('specieId') specieId?: number,
    @Body('characteristicId') characteristicId?: number,
  ) {
    return this.filesService.create(file, specieId, characteristicId);
  }
}
