export interface IPaginationOptions {
  page: number;
  limit: number;
}

export type Pagination = {
  total: number;
  hasMore: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type WithCountList<T> = [T[], number];
