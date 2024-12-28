import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../types/pagination-options';

export class InfinityPaginationResponseDto<T> {
  data: T[];
  pagination: Pagination;
}

export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classReference] })
    data!: T[];

    @ApiProperty({
      type: Boolean,
      example: true,
    })
    hasNextPage: boolean;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}
