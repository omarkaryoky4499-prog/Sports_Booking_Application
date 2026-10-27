import { SportType } from './FieldModel';

export type BookingStatus = 'upcoming' | 'completed';

export interface BookingSeed {
  id: string;
  fieldId: string;
  dayOffset: number;
  startTime: string;
  durationHours: number;
  status: BookingStatus;
}

export interface BookingModel {
  id: string;
  fieldId: string;
  fieldName: string;
  sport: SportType;
  area: string;
  address: string;
  date: string;
  startTime: string;
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
}

export interface CreateBookingInput {
  fieldId: string;
  date: string;
  startTime: string;
  durationHours: number;
}

export interface BookingConflictInput {
  fieldId: string;
  date: string;
  startTime: string;
  durationHours: number;
  ignoreBookingId?: string;
}
