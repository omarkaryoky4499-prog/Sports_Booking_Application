import { roundRating } from '../constants/format';
import { ReviewModel, ReviewSeed } from '../models/ReviewModel';
import { localDataStore } from './localDataStore';

export class ReviewService {
  getAll(): ReviewModel[] {
    return localDataStore.reviews.map((review) => this.toModel(review)).sort((a, b) => b.date.localeCompare(a.date));
  }

  getByField(fieldId: string): ReviewModel[] {
    return this.getAll().filter((review) => review.fieldId === fieldId);
  }

  getByAuthor(authorName: string): ReviewModel[] {
    return this.getAll().filter((review) => review.authorName === authorName);
  }

  getAverage(reviews: ReviewModel[]): number {
    if (reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return roundRating(total / reviews.length);
  }

  private toModel(review: ReviewSeed): ReviewModel {
    const field = localDataStore.fields.find((item) => item.id === review.fieldId);
    return {
      ...review,
      fieldName: field?.name ?? 'Field',
    };
  }
}

export const reviewService = new ReviewService();
