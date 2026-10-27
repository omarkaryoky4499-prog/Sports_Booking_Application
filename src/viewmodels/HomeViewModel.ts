import { useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { getFirstName, getGreeting } from '../constants/format';
import { BookingModel } from '../models/BookingModel';
import { FieldModel, SportType } from '../models/FieldModel';
import { bookingService } from '../services/bookingService';
import { fieldService } from '../services/fieldService';
import { userService } from '../services/userService';
import { useViewModelSubscription } from './useViewModelSubscription';
import { ViewModel } from './ViewModel';

export interface HomeState {
  greeting: string;
  firstName: string;
  featuredFields: FieldModel[];
  sports: SportType[];
  nextBooking: BookingModel | null;
  fieldCount: number;
}

const initialState: HomeState = {
  greeting: getGreeting(),
  firstName: '',
  featuredFields: [],
  sports: [],
  nextBooking: null,
  fieldCount: 0,
};

export class HomeViewModel extends ViewModel<HomeState> {
  constructor() {
    super(initialState);
    this.load();
  }

  load = (): void => {
    const profile = userService.getProfile();

    this.setState({
      greeting: getGreeting(),
      firstName: getFirstName(profile.fullName),
      featuredFields: fieldService.getFeatured(),
      sports: fieldService.getSports(),
      nextBooking: bookingService.getNextUpcoming(),
      fieldCount: fieldService.getAll().length,
    });
  };
}

export function useHomeViewModel(): HomeViewModel {
  const viewModel = useMemo(() => new HomeViewModel(), []);
  useViewModelSubscription(viewModel);

  useFocusEffect(
    useCallback(() => {
      viewModel.load();
    }, [viewModel]),
  );

  return viewModel;
}
