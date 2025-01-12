import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../../users/domain/user';
import { NullableType } from '../../../utils/types/nullable.type';
import { GetSpecieDto } from '../../../species/dto/get-all-species.dto';

class SimpleUser extends PickType(User, [
  'id',
  'firstName',
  'lastName',
  'email',
]) {}
export class GetPostDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  status: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  rejectReason: NullableType<string>;

  @ApiProperty({
    type: SimpleUser,
  })
  author: SimpleUser;
  @ApiProperty({
    type: GetSpecieDto,
  })
  specie: GetSpecieDto;

  @ApiProperty({
    type: SimpleUser,
    nullable: true,
  })
  validator: NullableType<SimpleUser>;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
