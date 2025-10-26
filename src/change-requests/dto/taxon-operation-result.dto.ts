import { ApiProperty } from '@nestjs/swagger';
import { OperationStatus } from './characteristic-operation-result.dto';

export class TaxonOperationResultDto {
  @ApiProperty({
    description: 'Status of the operation',
    enum: OperationStatus,
    example: OperationStatus.PENDING_APPROVAL,
  })
  status: OperationStatus;

  @ApiProperty({
    description: 'Message describing the outcome of the operation.',
    example: 'Taxon update request created and awaiting approval',
  })
  message: string;

  @ApiProperty({
    description:
      'Change request identifier when operation requires approval. Null when the change is applied immediately.',
    example: 42,
    nullable: true,
  })
  changeRequestId: number | null;

  @ApiProperty({
    description:
      'Number of species currently linked to this taxon. Provided only when awaiting approval.',
    example: 5,
    required: false,
  })
  affectedSpeciesCount?: number;
}
