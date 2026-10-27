import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { formatDisplayDate, formatDuration, formatPrice, formatTimeRange } from '../constants/format';
import { appConfig, colors, radius, shadows, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useBookingConfirmationViewModel } from '../viewmodels/BookingViewModel';

type ConfirmationProps = NativeStackScreenProps<RootStackParamList, 'BookingConfirmation'>;

export function BookingConfirmationScreen({ navigation, route }: ConfirmationProps) {
  const viewModel = useBookingConfirmationViewModel(route.params.bookingId);
  const insets = useSafeAreaInsets();
  const booking = viewModel.state.booking;

  const goHome = () => {
    navigation.popToTop();
  };

  const viewBookings = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'MyBookings' }],
    });
  };

  if (!booking) {
    return (
      <View style={styles.missing}>
        <StatusBar style="dark" />
        <Text style={styles.missingTitle}>Booking not found</Text>
        <PrimaryButton title="Back to home" onPress={goHome} />
      </View>
    );
  }

  return (
    <View style={styles.screen} testID="screen-confirmation">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={36} color={colors.white} />
        </View>
        <Text style={styles.kicker}>{appConfig.name}</Text>
        <Text style={styles.title}>You’re booked</Text>
        <Text style={styles.subtitle}>{booking.fieldName} is reserved. Show this confirmation when you arrive.</Text>

        <View style={styles.card}>
          <Detail label="Field" value={booking.fieldName} />
          <Detail label="Sport" value={booking.sport} />
          <Detail label="Date" value={formatDisplayDate(booking.date)} />
          <Detail label="Time" value={formatTimeRange(booking.startTime, booking.durationHours)} />
          <Detail label="Duration" value={formatDuration(booking.durationHours)} />
          <Detail label="Location" value={`${booking.area} · ${booking.address}`} />
          <Detail label="Reference" value={booking.id.toUpperCase()} />
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(booking.totalPrice)}</Text>
          </View>
        </View>

        <PrimaryButton title="View my bookings" onPress={viewBookings} testID="view-bookings" />
        <PrimaryButton title="Back to home" onPress={goHome} variant="outline" />
      </ScrollView>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  missingTitle: {
    ...typography.title,
  },
  content: {
    paddingHorizontal: spacing.xl,
    alignItems: 'stretch',
    gap: spacing.md,
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...shadows.header,
  },
  kicker: {
    ...typography.label,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  detail: {
    gap: 2,
  },
  detailLabel: {
    ...typography.caption,
  },
  detailValue: {
    ...typography.bodyStrong,
  },
  total: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.bodyStrong,
  },
  totalValue: {
    ...typography.title,
    color: colors.primaryDark,
  },
});
