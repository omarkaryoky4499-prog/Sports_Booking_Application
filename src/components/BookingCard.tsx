import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDisplayDate, formatDuration, formatPrice, formatTimeRange } from '../constants/format';
import { sportIcons } from '../constants/sports';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { BookingModel } from '../models/BookingModel';

type BookingCardProps = {
  booking: BookingModel;
  onPress?: () => void;
};

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const isUpcoming = booking.status === 'upcoming';
  const content = (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: isUpcoming ? colors.primary : colors.textMuted }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.sportRow}>
            <Ionicons name={sportIcons[booking.sport]} size={16} color={colors.primaryDark} />
            <Text style={styles.sport}>{booking.sport}</Text>
          </View>
          <View style={[styles.pill, isUpcoming ? styles.pillUpcoming : styles.pillPrevious]}>
            <Text style={[styles.pillLabel, isUpcoming ? styles.pillLabelUpcoming : styles.pillLabelPrevious]}>
              {isUpcoming ? 'Upcoming' : 'Completed'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>{booking.fieldName}</Text>
        <Text style={styles.meta}>
          {formatDisplayDate(booking.date)} · {formatTimeRange(booking.startTime, booking.durationHours)}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.location}>
            {booking.area} · {formatDuration(booking.durationHours)}
          </Text>
          <Text style={styles.price}>{formatPrice(booking.totalPrice)}</Text>
        </View>
      </View>
    </View>
  );

  if (!onPress) {
    return <View style={styles.shadow}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${booking.fieldName} booking`}
      onPress={onPress}
      style={({ pressed }) => [styles.shadow, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...shadows.card,
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sport: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  pillUpcoming: {
    backgroundColor: colors.primarySoft,
  },
  pillPrevious: {
    backgroundColor: colors.background,
  },
  pillLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  pillLabelUpcoming: {
    color: colors.primaryDark,
  },
  pillLabelPrevious: {
    color: colors.textSecondary,
  },
  name: {
    ...typography.bodyStrong,
    fontSize: 17,
  },
  meta: {
    ...typography.caption,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  location: {
    ...typography.caption,
    flex: 1,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
  },
});
