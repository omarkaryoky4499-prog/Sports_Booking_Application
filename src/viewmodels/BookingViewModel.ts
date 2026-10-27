import { useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { addHours, toIsoDate } from '../constants/format';
import { BookingModel } from '../models/BookingModel';
import { FieldModel } from '../models/FieldModel';
import { bookingService } from '../services/bookingService';
import { fieldService } from '../services/fieldService';
import { useViewModelSubscription } from './useViewModelSubscription';
import { ViewModel } from './ViewModel';

export type BookingTab = 'upcoming' | 'previous';
export type BookingDuration = 1 | 2;

export interface DateOption {
  iso: string;
  weekday: string;
  day: string;
}

export interface SlotOption {
  time: string;
  available: boolean;
}

export interface BookingState {
  upcoming: BookingModel[];
  previous: BookingModel[];
  tab: BookingTab;
  field: FieldModel | null;
  dates: DateOption[];
  selectedDate: string;
  selectedTime: string;
  durationHours: BookingDuration;
  booking: BookingModel | null;
  error: string | null;
}

function buildDates(): DateOption[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    return {
      iso: toIsoDate(date),
      weekday: offset === 0 ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'short' }),
      day: String(date.getDate()),
    };
  });
}

const initialState: BookingState = {
  upcoming: [],
  previous: [],
  tab: 'upcoming',
  field: null,
  dates: [],
  selectedDate: '',
  selectedTime: '',
  durationHours: 1,
  booking: null,
  error: null,
};

export class BookingViewModel extends ViewModel<BookingState> {
  constructor() {
    super(initialState);
  }

  loadLists = (): void => {
    this.setState({
      upcoming: bookingService.getUpcoming(),
      previous: bookingService.getPrevious(),
    });
  };

  setTab = (tab: BookingTab): void => {
    this.setState({ tab });
  };

  prepare = (fieldId: string): void => {
    const dates = buildDates();
    this.setState({
      field: fieldService.getById(fieldId) ?? null,
      dates,
      selectedDate: dates[0]?.iso ?? '',
      selectedTime: '',
      durationHours: 1,
      error: null,
    });
  };

  loadBooking = (bookingId: string): void => {
    this.setState({
      booking: bookingService.getById(bookingId) ?? null,
    });
  };

  setDate = (selectedDate: string): void => {
    const selectedTime = this.isTimeAvailable(this.state.selectedTime, this.state.durationHours, selectedDate)
      ? this.state.selectedTime
      : '';
    this.setState({ selectedDate, selectedTime, error: null });
  };

  setTime = (selectedTime: string): void => {
    if (!this.isTimeAvailable(selectedTime)) {
      return;
    }
    this.setState({ selectedTime, error: null });
  };

  setDuration = (durationHours: BookingDuration): void => {
    const selectedTime = this.isTimeAvailable(this.state.selectedTime, durationHours, this.state.selectedDate)
      ? this.state.selectedTime
      : '';
    this.setState({ durationHours, selectedTime, error: null });
  };

  confirm = (): BookingModel | null => {
    const { field, selectedDate, selectedTime, durationHours } = this.state;
    if (!field || !selectedDate || !selectedTime) {
      this.setState({ error: 'Choose a date and an open time slot.' });
      return null;
    }
    if (!this.isTimeAvailable(selectedTime, durationHours, selectedDate)) {
      this.setState({ error: 'That slot is no longer open. Pick another time.' });
      return null;
    }

    try {
      const booking = bookingService.create({
        fieldId: field.id,
        date: selectedDate,
        startTime: selectedTime,
        durationHours,
      });
      this.setState({ booking, error: null });
      return booking;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to complete this booking.';
      this.setState({ error: message });
      return null;
    }
  };

  get visibleBookings(): BookingModel[] {
    return this.state.tab === 'upcoming' ? this.state.upcoming : this.state.previous;
  }

  get slots(): SlotOption[] {
    if (!this.state.field) {
      return [];
    }
    return this.state.field.availableSlots.map((time) => ({
      time,
      available: this.isTimeAvailable(time),
    }));
  }

  get totalPrice(): number {
    if (!this.state.field) {
      return 0;
    }
    return this.state.field.pricePerHour * this.state.durationHours;
  }

  get canConfirm(): boolean {
    return Boolean(this.state.field && this.state.selectedDate && this.state.selectedTime);
  }

  private isTimeAvailable(
    time: string,
    duration = this.state.durationHours,
    date = this.state.selectedDate,
  ): boolean {
    const field = this.state.field;
    if (!field || !time || !date) {
      return false;
    }
    if (!field.availableSlots.includes(time)) {
      return false;
    }
    if (duration === 2 && !field.availableSlots.includes(addHours(time, 1))) {
      return false;
    }
    return !bookingService.hasConflict({
      fieldId: field.id,
      date,
      startTime: time,
      durationHours: duration,
    });
  }
}

export function useMyBookingsViewModel(): BookingViewModel {
  const viewModel = useMemo(() => {
    const vm = new BookingViewModel();
    vm.loadLists();
    return vm;
  }, []);
  useViewModelSubscription(viewModel);

  useFocusEffect(
    useCallback(() => {
      viewModel.loadLists();
    }, [viewModel]),
  );

  return viewModel;
}

export function useBookingComposerViewModel(fieldId: string): BookingViewModel {
  const viewModel = useMemo(() => {
    const vm = new BookingViewModel();
    vm.prepare(fieldId);
    return vm;
  }, [fieldId]);
  useViewModelSubscription(viewModel);
  return viewModel;
}

export function useBookingConfirmationViewModel(bookingId: string): BookingViewModel {
  const viewModel = useMemo(() => {
    const vm = new BookingViewModel();
    vm.loadBooking(bookingId);
    return vm;
  }, [bookingId]);
  useViewModelSubscription(viewModel);
  return viewModel;
}
