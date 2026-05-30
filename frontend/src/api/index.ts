import axios from 'axios';
import type { WorkEntry, WorkEntryFormData, WorkType, WorkTypeFormData, SortOrder } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Entries
export const getEntries = async (params: {
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: SortOrder;
}): Promise<WorkEntry[]> => {
  const { data } = await api.get('/entries', { params });
  return data;
};

export const createEntry = async (payload: WorkEntryFormData): Promise<WorkEntry> => {
  const { data } = await api.post('/entries', payload);
  return data;
};

export const updateEntry = async (id: number, payload: WorkEntryFormData): Promise<WorkEntry> => {
  const { data } = await api.put(`/entries/${id}`, payload);
  return data;
};

export const deleteEntry = async (id: number): Promise<void> => {
  await api.delete(`/entries/${id}`);
};

// Work Types
export const getWorkTypes = async (): Promise<WorkType[]> => {
  const { data } = await api.get('/work-types');
  return data;
};

export const createWorkType = async (payload: WorkTypeFormData): Promise<WorkType> => {
  const { data } = await api.post('/work-types', payload);
  return data;
};

export const deleteWorkType = async (id: number): Promise<void> => {
  await api.delete(`/work-types/${id}`);
};
