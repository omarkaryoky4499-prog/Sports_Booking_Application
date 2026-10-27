import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { formatHourlyPrice } from '../constants/format';
import { sportIcons } from '../constants/sports';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { FieldModel } from '../models/FieldModel';
import { RatingStars } from './RatingStars';

type FieldCardProps = {
  field: FieldModel;
  onPress: () => void;
  layout?: 'list' | 'featured';
};

export function FieldCard({ field, onPress, layout = 'list' }: FieldCardProps) {
  const { width } = useWindowDimensions();
  const featuredWidth = Math.min(width * 0.72, 300);

  if (layout === 'featured') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${field.name}, ${field.sport}`}
        onPress={onPress}
        style={[styles.shadow, { width: featuredWidth }]}
      >
        <View style={styles.featuredCard}>
          <View style={[styles.featuredHero, { backgroundColor: field.accentColor }]}>
            <View style={styles.heroIcon}>
              <Ionicons name={sportIcons[field.sport]} size={22} color={colors.white} />
            </View>
            <Text style={styles.heroSport}>{field.sport}</Text>
          </View>
          <View style={styles.featuredBody}>
            <Text style={styles.name} numberOfLines={1}>
              {field.name}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {field.area}, {field.city}
            </Text>
            <View style={styles.footer}>
              <RatingStars rating={field.rating} showValue />
              <Text style={styles.price}>{formatHourlyPrice(field.pricePerHour)}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${field.name}, ${field.sport}`}
      onPress={onPress}
      style={styles.shadow}
    >
      <View style={styles.listCard}>
        <View style={[styles.iconWrap, { backgroundColor: field.accentColor }]}>
          <Ionicons name={sportIcons[field.sport]} size={24} color={colors.white} />
        </View>
        <View style={styles.listBody}>
          <Text style={styles.name} numberOfLines={1}>
            {field.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {field.sport} · {field.area}
          </Text>
          <RatingStars rating={field.rating} showValue />
        </View>
        <View style={styles.listPrice}>
          <Text style={styles.price}>{formatHourlyPrice(field.pricePerHour)}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...shadows.card,
    borderRadius: radius.lg,
  },
  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  featuredHero: {
    height: 92,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  heroIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSport: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  featuredBody: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBody: {
    flex: 1,
    gap: 2,
  },
  listPrice: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  name: {
    ...typography.bodyStrong,
    fontSize: 16,
  },
  meta: {
    ...typography.caption,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  price: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
