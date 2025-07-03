export interface Student {
  id: string;
  name: string;
  department: string;
  studyLevel: string;
  birthPlace: string;
  roomNumber: string;
  floorNumber: string;
  payments: Payment[];
  dateAdded: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  month: string;
  year: number;
  confirmed: boolean;
}

export interface User {
  username: string;
  password: string;
}

export type SortField = 'name' | 'date' | 'room' | 'floor' | 'amount';
export type SortOrder = 'asc' | 'desc';

export interface PaymentSummary {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  currentMonthTotal: number;
}