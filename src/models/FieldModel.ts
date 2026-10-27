export const SPORT_TYPES = ['Football', 'Basketball', 'Tennis', 'Padel'] as const;

export type SportType = (typeof SPORT_TYPES)[number];

export function isSportType(value: string): value is SportType {
  return (SPORT_TYPES as readonly string[]).includes(value);
}

export interface FieldSeed {
  id: string;
  name: string;
  sport: SportType;
  area: string;
  city: string;
  address: string;
  pricePerHour: number;
  description: string;
  amenities: string[];
  surface: string;
  capacity: string;
  openingHours: string;
  availableSlots: string[];
  accentColor: string;
}

export interface FieldModel extends FieldSeed {
  rating: number;
  reviewCount: number;
}

export interface FieldSearchFilters {
  query: string;
  sport: SportType | 'All';
  area: string;
  maxPrice: number | null;
}

export interface PriceOption {
  label: string;
  value: number | null;
}
