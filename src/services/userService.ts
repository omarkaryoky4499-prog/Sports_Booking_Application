import { SportType } from '../models/FieldModel';
import { UserModel } from '../models/UserModel';
import { localDataStore } from './localDataStore';

export class UserService {
  getProfile(): UserModel {
    return localDataStore.user;
  }

  updateFavoriteSport(favoriteSport: SportType): UserModel {
    localDataStore.user = {
      ...localDataStore.user,
      favoriteSport,
    };
    return localDataStore.user;
  }
}

export const userService = new UserService();
