
export interface Repair {
  id: string;
  orderNumber: string;
  clientName: string;
  email: string;
  phone: string;
  deviceType: string;
  issueDescription: string;
  estimationPrice?: number;
  dateReceived: string;
  status: 'Received' | 'Diagnosing' | 'Repairing' | 'Completed';
  expectedCompletion?: string;
  createdAt: string;
}

export interface RepairStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  total: number;
}
