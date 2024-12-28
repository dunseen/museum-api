import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';

export const infinityPagination = <T>(
  data: [T[], number],
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  const [result, total] = data;
  const { page, limit } = options;

  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  const hasMore = page * limit < total;

  return {
    data: result,
    pagination: {
      total,
      hasMore,
      nextPage,
      prevPage,
    },
  };
};
