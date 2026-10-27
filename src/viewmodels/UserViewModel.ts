import { useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { SPORT_TYPES, SportType } from '../models/FieldModel';
import { UserModel } from '../models/UserModel';
import { bookingService } from '../services/bookingService';
import { reviewService } from '../services/reviewService';
import { userService } from '../services/userService';
import { useViewModelSubscription } from './useViewModelSubscription';
import { ViewModel } from './ViewModel';

export interface UserState {
  user: UserModel | null;
  bookingsCount: number;
  upcomingCount: number;
  reviewsCount: number;
  sports: SportType[];
}

const initialState: UserState = {
  user: null,
  bookingsCount: 0,
  upcomingCount: 0,
  reviewsCount: 0,
  sports: [...SPORT_TYPES],
};

export class UserViewModel extends ViewModel<UserState> {
  constructor() {
    super(initialState);
    this.load();
  }

  load = (): void => {
    const profile = userService.getProfile();

    this.setState({
      user: profile,
      bookingsCount: bookingService.getAll().length,
      upcomingCount: bookingService.getUpcoming().length,
      reviewsCount: reviewService.getByAuthor(profile.fullName).length,
      sports: [...SPORT_TYPES],
    });
  };

  setFavoriteSport = (favoriteSport: SportType): void => {
    const user = userService.updateFavoriteSport(favoriteSport);
    this.setState({ user });
  };
}

export function useUserViewModel(): UserViewModel {
  const viewModel = useMemo(() => new UserViewModel(), []);
  useViewModelSubscription(viewModel);

  useFocusEffect(
    useCallback(() => {
      viewModel.load();
    }, [viewModel]),
  );

  return viewModel;
}
