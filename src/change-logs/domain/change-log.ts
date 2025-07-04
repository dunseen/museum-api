import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class ChangeLog {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tableName: string;

  @ApiProperty()
  action: string;

  @ApiProperty({ required: false, type: Object, nullable: true })
  oldValue: Record<string, unknown> | null;

  @ApiProperty({ required: false, type: Object, nullable: true })
  newValue: Record<string, unknown> | null;

  @ApiProperty({ type: User })
  changedBy: User;

  @ApiProperty({ type: User })
  approvedBy: User;

  @ApiProperty()
  createdAt: Date;
}
