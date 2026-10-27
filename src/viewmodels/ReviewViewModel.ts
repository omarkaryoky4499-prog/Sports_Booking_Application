import { useMemo } from 'react';

import { ReviewModel } from '../models/ReviewModel';
import { reviewService } from '../services/reviewService';
import { useViewModelSubscription } from './useViewModelSubscription';
import { ViewModel } from './ViewModel';

export interface ReviewState {
  reviews: ReviewModel[];
  fieldId?: string;
  heading: string;
  average: number;
  distribution: number[];
}

const initialState: ReviewState = {
  reviews: [],
  heading: 'Player reviews',
  average: 0,
  distribution: [0, 0, 0, 0, 0],
};

export class ReviewViewModel extends ViewModel<ReviewState> {
  constructor() {
    super(initialState);
  }

  load = (fieldId?: string): void => {
    const reviews = fieldId ? reviewService.getByField(fieldId) : reviewService.getAll();
    const fieldName = reviews[0]?.fieldName;
    this.setState({
      reviews,
      fieldId,
      heading: fieldId && fieldName ? fieldName : 'Player reviews',
      average: reviewService.getAverage(reviews),
      distribution: [5, 4, 3, 2, 1].map((star) => reviews.filter((review) => review.rating === star).length),
    });
  };
}

export function useReviewsViewModel(fieldId?: string): ReviewViewModel {
  const viewModel = useMemo(() => {
    const vm = new ReviewViewModel();
    vm.load(fieldId);
    return vm;
  }, [fieldId]);
  useViewModelSubscription(viewModel);
  return viewModel;
}
