export interface IPaginationOptions {
  page: number;
  limit: number;
  filters?: {
    name?: string;
    description?: string;
  };
}

export type Pagination = {
  total: number;
  hasMore: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type WithCountList<T> = [T[], number];
