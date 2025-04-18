export interface IPaginationOptions {
  page: number;
  limit: number;
  filters?: {
    name?: string;
    email?: string;
    description?: string;
    genus?: string;
    family?: string;
    characteristicIds?: string[];
    hierarchyId?: number;
  };
}

export type Pagination = {
  total: number;
  hasMore: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type WithCountList<T> = [T[], number];
