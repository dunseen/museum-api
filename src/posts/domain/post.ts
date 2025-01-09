import { ApiProperty } from '@nestjs/swagger';
import { NullableType } from '../../utils/types/nullable.type';
import { PostStatusEnum } from '../post-status.enum';
import { User } from '../../users/domain/user';
import { Specie } from '../../species/domain/specie';

export class Post {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: typeof PostStatusEnum,
  })
  status: PostStatusEnum;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  reject_reason: NullableType<string>;

  @ApiProperty({
    type: User,
  })
  author: User;

  @ApiProperty({
    type: User,
    nullable: true,
  })
  validator: NullableType<User>;

  @ApiProperty({
    type: Specie,
  })
  specie: Specie;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
