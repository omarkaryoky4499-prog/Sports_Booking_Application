import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { SportType } from '../models/FieldModel';

export type SportIconName = ComponentProps<typeof Ionicons>['name'];

export const sportIcons: Record<SportType, SportIconName> = {
  Football: 'football',
  Basketball: 'basketball',
  Tennis: 'tennisball',
  Padel: 'grid',
};
