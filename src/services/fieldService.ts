import { roundRating } from '../constants/format';
import { FieldModel, FieldSearchFilters, SportType } from '../models/FieldModel';
import { localDataStore } from './localDataStore';

export class FieldService {
  getAll(): FieldModel[] {
    return localDataStore.fields
      .map((field) => this.withRating(field))
      .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
  }

  getById(id: string): FieldModel | undefined {
    return this.getAll().find((field) => field.id === id);
  }

  getFeatured(): FieldModel[] {
    return this.getAll();
  }

  search(filters: FieldSearchFilters): FieldModel[] {
    const query = filters.query.trim().toLowerCase();

    return this.getAll().filter((field) => {
      const haystack = [field.name, field.area, field.city, field.address, field.sport, field.surface]
        .join(' ')
        .toLowerCase();

      const matchesQuery = query.length === 0 || haystack.includes(query);
      const matchesSport = filters.sport === 'All' || field.sport === filters.sport;
      const matchesArea = filters.area === 'All' || field.area === filters.area;
      const matchesPrice = filters.maxPrice == null || field.pricePerHour <= filters.maxPrice;

      return matchesQuery && matchesSport && matchesArea && matchesPrice;
    });
  }

  getSports(): SportType[] {
    return [...new Set(localDataStore.fields.map((field) => field.sport))];
  }

  getAreas(): string[] {
    return [...new Set(localDataStore.fields.map((field) => field.area))];
  }

  private withRating(field: (typeof localDataStore.fields)[number]): FieldModel {
    const ratings = localDataStore.reviews
      .filter((review) => review.fieldId === field.id)
      .map((review) => review.rating);

    const rating =
      ratings.length === 0 ? 0 : roundRating(ratings.reduce((sum, value) => sum + value, 0) / ratings.length);

    return {
      ...field,
      rating,
      reviewCount: ratings.length,
    };
  }
}

export const fieldService = new FieldService();
