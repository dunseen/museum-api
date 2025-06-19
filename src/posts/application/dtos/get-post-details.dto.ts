import { OmitType } from '@nestjs/swagger';
import { GetPostDto } from './get-post.dto';

export class GetPostDetailsDto extends OmitType(GetPostDto, [
  'author',
  'validator',
  'updatedAt',
  'rejectReason',
  'status',
]) {}
