import bookingSeedsJson from '../assets/data/bookings.json';
import fieldSeedsJson from '../assets/data/fields.json';
import reviewSeedsJson from '../assets/data/reviews.json';
import userJson from '../assets/data/user.json';
import { shiftIsoDate } from '../constants/format';
import { BookingModel, BookingSeed } from '../models/BookingModel';
import { FieldSeed } from '../models/FieldModel';
import { ReviewSeed } from '../models/ReviewModel';
import { UserModel } from '../models/UserModel';

function isFieldSeed(value: unknown): value is FieldSeed {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
}

class LocalDataStore {
  readonly fields: FieldSeed[];
  readonly reviews: ReviewSeed[];
  bookings: BookingModel[];
  user: UserModel;

  constructor() {
    this.fields = (fieldSeedsJson as unknown[]).filter(isFieldSeed) as FieldSeed[];
    this.reviews = reviewSeedsJson as ReviewSeed[];
    this.user = userJson as UserModel;
    this.bookings = (bookingSeedsJson as BookingSeed[])
      .map((seed) => this.hydrateBooking(seed))
      .filter((booking): booking is BookingModel => booking !== null);
  }

  hydrateBooking(seed: BookingSeed): BookingModel | null {
    const field = this.fields.find((entry) => entry.id === seed.fieldId);
    if (!field) {
      return null;
    }

    return {
      id: seed.id,
      fieldId: field.id,
      fieldName: field.name,
      sport: field.sport,
      area: field.area,
      address: field.address,
      date: shiftIsoDate(seed.dayOffset),
      startTime: seed.startTime,
      durationHours: seed.durationHours,
      totalPrice: field.pricePerHour * seed.durationHours,
      status: seed.status,
    };
  }
}

export const localDataStore = new LocalDataStore();
