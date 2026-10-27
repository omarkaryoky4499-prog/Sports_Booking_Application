import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingCard } from '../components/BookingCard';
import { colors, radius, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { BookingTab, useMyBookingsViewModel } from '../viewmodels/BookingViewModel';

type MyBookingsProps = NativeStackScreenProps<RootStackParamList, 'MyBookings'>;

const tabs: { id: BookingTab; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'previous', label: 'Previous' },
];

export function MyBookingsScreen({ navigation }: MyBookingsProps) {
  const viewModel = useMyBookingsViewModel();
  const insets = useSafeAreaInsets();
  const bookings = viewModel.visibleBookings;
  const isUpcoming = viewModel.state.tab === 'upcoming';

  return (
    <View style={styles.screen} testID="screen-bookings">
      <StatusBar style="dark" />
      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const selected = viewModel.state.tab === tab.id;
          const count = tab.id === 'upcoming' ? viewModel.state.upcoming.length : viewModel.state.previous.length;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => viewModel.setTab(tab.id)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
                {tab.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing.xl },
          bookings.length === 0 && styles.emptyList,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <BookingCard booking={item} onPress={() => navigation.navigate('FieldDetails', { fieldId: item.fieldId })} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name={isUpcoming ? 'calendar-outline' : 'time-outline'} size={22} color={colors.primaryDark} />
            </View>
            <Text style={styles.emptyTitle}>{isUpcoming ? 'No upcoming games' : 'No previous games'}</Text>
            <Text style={styles.emptyCopy}>
              {isUpcoming ? 'Book a field from home and it will show up here.' : 'Completed bookings will collect here.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabLabelSelected: {
    color: colors.white,
  },
  list: {
    paddingHorizontal: spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.title,
    textAlign: 'center',
  },
  emptyCopy: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
