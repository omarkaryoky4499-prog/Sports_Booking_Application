import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SectionHeader } from '../components/SectionHeader';
import { formatMonthYear, getInitials } from '../constants/format';
import { appConfig, colors, radius, shadows, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useUserViewModel } from '../viewmodels/UserViewModel';

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: ProfileProps) {
  const viewModel = useUserViewModel();
  const insets = useSafeAreaInsets();
  const { user, bookingsCount, upcomingCount, reviewsCount, sports } = viewModel.state;

  if (!user) {
    return <View style={styles.screen} />;
  }

  const details = [
    { icon: 'mail-outline' as const, label: 'Email', value: user.email },
    { icon: 'call-outline' as const, label: 'Phone', value: user.phone },
    { icon: 'location-outline' as const, label: 'City', value: user.city },
    { icon: 'calendar-outline' as const, label: 'Member since', value: formatMonthYear(user.memberSince) },
  ];

  return (
    <View style={styles.screen} testID="screen-profile">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.subtitle}>
            {user.city} · {user.favoriteSport}
          </Text>
        </View>

        <View style={styles.body}>
          <View style={styles.stats}>
            <Stat value={String(bookingsCount)} label="Bookings" />
            <Stat value={String(upcomingCount)} label="Upcoming" />
            <Stat value={String(reviewsCount)} label="Reviews" />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Account" />
            <View style={styles.card}>
              {details.map((detail, index) => (
                <View key={detail.label} style={[styles.row, index < details.length - 1 && styles.rowBorder]}>
                  <View style={styles.rowIcon}>
                    <Ionicons name={detail.icon} size={18} color={colors.primaryDark} />
                  </View>
                  <View style={styles.rowCopy}>
                    <Text style={styles.rowLabel}>{detail.label}</Text>
                    <Text style={styles.rowValue}>{detail.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Favorite sport" />
            <View style={styles.chips}>
              {sports.map((sport) => {
                const selected = sport === user.favoriteSport;
                return (
                  <Pressable
                    key={sport}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => viewModel.setFavoriteSport(sport)}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{sport}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Text style={styles.footer}>
            {appConfig.name} · {appConfig.tagline}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    alignItems: 'center',
  },
  back: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  name: {
    ...typography.hero,
    fontSize: 26,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.88)',
    marginTop: spacing.xs,
  },
  body: {
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  stats: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    ...shadows.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.title,
    color: colors.primaryDark,
  },
  statLabel: {
    ...typography.caption,
  },
  section: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...typography.caption,
  },
  rowValue: {
    ...typography.bodyStrong,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  chipLabelSelected: {
    color: colors.white,
  },
  footer: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
