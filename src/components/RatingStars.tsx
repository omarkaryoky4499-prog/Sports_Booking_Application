import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { formatRating } from '../constants/format';
import { colors, spacing, typography } from '../constants/theme';

type RatingStarsProps = {
  rating: number;
  size?: number;
  showValue?: boolean;
};

export function RatingStars({ rating, size = 14, showValue = false }: RatingStarsProps) {
  return (
    <View style={styles.row} accessibilityLabel={`Rated ${formatRating(rating)} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        const name = rating >= starNumber ? 'star' : rating >= starNumber - 0.5 ? 'star-half' : 'star-outline';
        return <Ionicons key={starNumber} name={name} size={size} color={colors.star} />;
      })}
      {showValue ? <Text style={[styles.value, { fontSize: size }]}>{formatRating(rating)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  value: {
    ...typography.caption,
    marginLeft: spacing.xs,
    color: colors.text,
    fontWeight: '700',
  },
});
