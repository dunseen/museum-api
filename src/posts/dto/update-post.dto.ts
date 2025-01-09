// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectReason?: string;
}
