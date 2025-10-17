import { SpecialistType } from '../../specialists/domain/specialist';
import { ChangeRequestStatus } from '../../change-requests/domain/change-request';

export interface IPaginationOptions {
  page: number;
  limit: number;
  filters?: {
    name?: string;
    specialistType?: SpecialistType;
    email?: string;
    description?: string;
    characteristicIds?: string[];
    hierarchyId?: number;
    orderName?: string;
    orderHierarchyId?: number;
    familyName?: string;
    familyHierarchyId?: number;
    genusName?: string;
    genusHierarchyId?: number;
    specieStatus?: ChangeRequestStatus;
  };
}

export type Pagination = {
  total: number;
  hasMore: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type WithCountList<T> = [T[], number];
