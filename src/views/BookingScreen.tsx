import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { formatDuration, formatHourlyPrice, formatPrice } from '../constants/format';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { BookingDuration, useBookingComposerViewModel } from '../viewmodels/BookingViewModel';

type BookingProps = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const durations: BookingDuration[] = [1, 2];

export function BookingScreen({ navigation, route }: BookingProps) {
  const viewModel = useBookingComposerViewModel(route.params.fieldId);
  const insets = useSafeAreaInsets();
  const { field, dates, selectedDate, selectedTime, durationHours, error } = viewModel.state;

  if (!field) {
    return (
      <View style={styles.missing}>
        <StatusBar style="dark" />
        <Text style={styles.missingTitle}>This field is unavailable</Text>
        <PrimaryButton title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const confirm = () => {
    const booking = viewModel.confirm();
    if (booking) {
      navigation.replace('BookingConfirmation', { bookingId: booking.id });
    }
  };

  return (
    <View style={styles.screen} testID="screen-booking">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.summary}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <Text style={styles.fieldMeta}>
            {field.sport} · {field.area} · {formatHourlyPrice(field.pricePerHour)}
          </Text>
        </View>

        <Text style={styles.label}>Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dates.map((date) => {
            const selected = date.iso === selectedDate;
            return (
              <Pressable
                key={date.iso}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => viewModel.setDate(date.iso)}
                style={[styles.dateChip, selected && styles.dateChipSelected]}
              >
                <Text style={[styles.dateWeekday, selected && styles.selectedText]}>{date.weekday}</Text>
                <Text style={[styles.dateDay, selected && styles.selectedText]}>{date.day}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Duration</Text>
        <View style={styles.durationRow}>
          {durations.map((duration) => {
            const selected = duration === durationHours;
            return (
              <Pressable
                key={duration}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => viewModel.setDuration(duration)}
                style={[styles.durationChip, selected && styles.durationChipSelected]}
              >
                <Text style={[styles.durationText, selected && styles.selectedText]}>{formatDuration(duration)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Time</Text>
        <Text style={styles.hint}>Open slots follow this field’s hours. Reserved times stay unavailable.</Text>
        <View style={styles.slots}>
          {viewModel.slots.map((slot) => {
            const selected = slot.time === selectedTime;
            return (
              <Pressable
                key={slot.time}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: !slot.available }}
                disabled={!slot.available}
                onPress={() => viewModel.setTime(slot.time)}
                style={[styles.slot, selected && styles.slotSelected, !slot.available && styles.slotDisabled]}
              >
                <Text style={[styles.slotText, selected && styles.selectedText, !slot.available && styles.slotTextDisabled]}>
                  {slot.time}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.breakdown}>
          <Row label="Hourly rate" value={formatPrice(field.pricePerHour)} />
          <Row label="Duration" value={formatDuration(durationHours)} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(viewModel.totalPrice)}</Text>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.confirm}>
          <PrimaryButton title="Confirm booking" onPress={confirm} disabled={!viewModel.canConfirm} testID="confirm-booking" />
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  missingTitle: {
    ...typography.title,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  fieldName: {
    ...typography.title,
  },
  fieldMeta: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  label: {
    ...typography.label,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  hint: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  dateRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dateChip: {
    width: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: 2,
  },
  dateChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateWeekday: {
    ...typography.caption,
  },
  dateDay: {
    ...typography.title,
  },
  selectedText: {
    color: colors.white,
  },
  durationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  durationChip: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  durationText: {
    ...typography.bodyStrong,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    width: '31%',
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  slotText: {
    ...typography.bodyStrong,
  },
  slotTextDisabled: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  breakdown: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.soft,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowLabel: {
    ...typography.caption,
  },
  rowValue: {
    ...typography.bodyStrong,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    ...typography.bodyStrong,
  },
  totalValue: {
    ...typography.title,
    color: colors.primaryDark,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  confirm: {
    marginTop: spacing.lg,
  },
});
