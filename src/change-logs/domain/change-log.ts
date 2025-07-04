import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ required: false, nullable: true })
  changedBy: string | null;

  @ApiProperty({ required: false, nullable: true })
  approvedBy: string | null;

  @ApiProperty()
  createdAt: Date;
}
