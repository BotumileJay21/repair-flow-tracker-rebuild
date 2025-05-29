
import { Repair, RepairStats } from '../types';

const STORAGE_KEY = 'jbv_repairs';
const COUNTER_KEY = 'jbv_repair_counter';

export const getRepairs = (): Repair[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRepair = (repair: Repair): void => {
  const repairs = getRepairs();
  repairs.push(repair);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(repairs));
};

export const updateRepair = (id: string, updates: Partial<Repair>): void => {
  const repairs = getRepairs();
  const index = repairs.findIndex(r => r.id === id);
  if (index !== -1) {
    repairs[index] = { ...repairs[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repairs));
  }
};

export const deleteRepair = (id: string): void => {
  const repairs = getRepairs();
  const filtered = repairs.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const generateOrderNumber = (): string => {
  const stored = localStorage.getItem(COUNTER_KEY);
  const counter = stored ? parseInt(stored) + 1 : 1;
  localStorage.setItem(COUNTER_KEY, counter.toString());
  return `JBV-${counter.toString().padStart(3, '0')}`;
};

export const getRepairByOrderNumber = (orderNumber: string): Repair | null => {
  const repairs = getRepairs();
  return repairs.find(r => r.orderNumber === orderNumber) || null;
};

export const getStats = (): RepairStats => {
  const repairs = getRepairs();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYear = new Date(now.getFullYear(), 0, 1);

  return {
    today: repairs.filter(r => new Date(r.dateReceived) >= today).length,
    thisWeek: repairs.filter(r => new Date(r.dateReceived) >= thisWeek).length,
    thisMonth: repairs.filter(r => new Date(r.dateReceived) >= thisMonth).length,
    thisYear: repairs.filter(r => new Date(r.dateReceived) >= thisYear).length,
    total: repairs.length
  };
};
