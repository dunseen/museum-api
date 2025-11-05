import { ApiProperty } from '@nestjs/swagger';

export enum OperationStatus {
  COMPLETED = 'completed',
  PENDING_APPROVAL = 'pending_approval',
}

export class CharacteristicOperationResultDto {
  @ApiProperty({
    description: 'Status of the operation',
    enum: OperationStatus,
    example: OperationStatus.COMPLETED,
  })
  status: OperationStatus;

  @ApiProperty({
    description:
      'Message describing the result. For completed: instant operation. For pending: awaiting approval.',
    example: 'Characteristic updated successfully',
  })
  message: string;

  @ApiProperty({
    description:
      'Change request ID if operation requires approval. Null if operation was completed instantly.',
    example: 123,
    nullable: true,
  })
  changeRequestId: number | null;

  @ApiProperty({
    description:
      'Number of species currently using this characteristic (only present if status is pending_approval)',
    example: 5,
    required: false,
  })
  affectedSpeciesCount?: number;
}
