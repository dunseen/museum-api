import { ApiProperty, PickType } from '@nestjs/swagger';
import { GetPostDto } from './get-post.dto';
import { User } from 'src/users/domain/user';
import { NullableType } from 'src/utils/types/nullable.type';

class SimpleUser extends PickType(User, [
  'id',
  'firstName',
  'lastName',
  'email',
]) {}
export class GetPostDetailsDto extends GetPostDto {
  @ApiProperty({
    type: SimpleUser,
  })
  author: SimpleUser;

  @ApiProperty({
    type: SimpleUser,
    nullable: true,
  })
  validator: NullableType<SimpleUser>;
}
