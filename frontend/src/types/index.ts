export interface WorkType {
  id: number;
  name: string;
  unit: string;
  createdAt: string;
}

export interface WorkEntry {
  id: number;
  date: string;
  workTypeId: number;
  workType: WorkType;
  volume: number;
  unit: string;
  executor: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkEntryFormData {
  date: string;
  workTypeId: number;
  volume: number;
  unit: string;
  executor: string;
  notes?: string;
}

export interface WorkTypeFormData {
  name: string;
  unit: string;
}

export type SortOrder = 'asc' | 'desc';

export interface FiltersState {
  dateFrom: string;
  dateTo: string;
  sortOrder: SortOrder;
}
