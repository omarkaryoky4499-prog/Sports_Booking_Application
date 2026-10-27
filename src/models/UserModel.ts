import { SportType } from './FieldModel';

export interface UserModel {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  memberSince: string;
  favoriteSport: SportType;
}
