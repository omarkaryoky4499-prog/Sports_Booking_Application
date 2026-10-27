import { rangesOverlap } from '../constants/format';
import { BookingConflictInput, BookingModel, CreateBookingInput } from '../models/BookingModel';
import { fieldService } from './fieldService';
import { localDataStore } from './localDataStore';

function compareSchedule(a: BookingModel, b: BookingModel): number {
  const dateOrder = a.date.localeCompare(b.date);
  return dateOrder !== 0 ? dateOrder : a.startTime.localeCompare(b.startTime);
}

export class BookingService {
  getAll(): BookingModel[] {
    return [...localDataStore.bookings];
  }

  getById(id: string): BookingModel | undefined {
    return localDataStore.bookings.find((booking) => booking.id === id);
  }

  getUpcoming(): BookingModel[] {
    return this.getAll()
      .filter((booking) => booking.status === 'upcoming')
      .sort(compareSchedule);
  }

  getPrevious(): BookingModel[] {
    return this.getAll()
      .filter((booking) => booking.status === 'completed')
      .sort((a, b) => compareSchedule(b, a));
  }

  getNextUpcoming(): BookingModel | null {
    return this.getUpcoming()[0] ?? null;
  }

  hasConflict(input: BookingConflictInput): boolean {
    return localDataStore.bookings.some((booking) => {
      if (booking.status !== 'upcoming') {
        return false;
      }
      if (input.ignoreBookingId && booking.id === input.ignoreBookingId) {
        return false;
      }
      if (booking.fieldId !== input.fieldId || booking.date !== input.date) {
        return false;
      }
      return rangesOverlap(input.startTime, input.durationHours, booking.startTime, booking.durationHours);
    });
  }

  create(input: CreateBookingInput): BookingModel {
    const field = fieldService.getById(input.fieldId);
    if (!field) {
      throw new Error('Selected field is no longer available.');
    }
    if (this.hasConflict(input)) {
      throw new Error('That time was just reserved. Choose another slot.');
    }

    const booking: BookingModel = {
      id: `book-${Date.now()}`,
      fieldId: field.id,
      fieldName: field.name,
      sport: field.sport,
      area: field.area,
      address: field.address,
      date: input.date,
      startTime: input.startTime,
      durationHours: input.durationHours,
      totalPrice: field.pricePerHour * input.durationHours,
      status: 'upcoming',
    };

    localDataStore.bookings = [...localDataStore.bookings, booking];
    return booking;
  }
}

export const bookingService = new BookingService();
