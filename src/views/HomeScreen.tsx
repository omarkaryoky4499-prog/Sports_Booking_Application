import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingCard } from '../components/BookingCard';
import { FieldCard } from '../components/FieldCard';
import { SectionHeader } from '../components/SectionHeader';
import { sportIcons } from '../constants/sports';
import { appConfig, colors, radius, shadows, spacing, typography } from '../constants/theme';
import { SportType } from '../models/FieldModel';
import { RootStackParamList } from '../navigation/types';
import { useHomeViewModel } from '../viewmodels/HomeViewModel';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const quickActions = [
  { title: 'Bookings', icon: 'calendar' as keyof typeof Ionicons.glyphMap, route: 'MyBookings' as const },
  { title: 'Reviews', icon: 'star' as keyof typeof Ionicons.glyphMap, route: 'Reviews' as const },
  { title: 'Profile', icon: 'person' as keyof typeof Ionicons.glyphMap, route: 'Profile' as const },
];

const benefits = [
  {
    icon: 'checkmark-circle' as const,
    title: 'Instant confirmation',
    text: 'Your slot is held as soon as you book.',
  },
  {
    icon: 'shield-checkmark' as const,
    title: 'Known venues',
    text: 'Stadiums, courts, and arenas across Cairo.',
  },
  {
    icon: 'pricetag' as const,
    title: 'Clear hourly rates',
    text: 'See the full price before you confirm.',
  },
];

export function HomeScreen({ navigation }: HomeProps) {
  const viewModel = useHomeViewModel();
  const insets = useSafeAreaInsets();
  const { greeting, firstName, featuredFields, sports, nextBooking, fieldCount } = viewModel.state;

  const openSport = (sport: SportType) => {
    navigation.navigate('FieldsList', {
      query: '',
      sport,
      area: 'All',
      maxPrice: null,
    });
  };

  return (
    <View style={styles.screen} testID="screen-home">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <Text style={styles.brand}>{appConfig.name}</Text>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{firstName || 'Player'}</Text>
          <Text style={styles.tagline}>
            {fieldCount} venues ready around Cairo. {appConfig.tagline}.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search fields"
            onPress={() => navigation.navigate('SearchFields')}
            style={styles.search}
            testID="home-search"
          >
            <Ionicons name="search" size={18} color={colors.primaryDark} />
            <Text style={styles.searchText}>Search pitches, courts, and arenas</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.actionsCard}>
            {quickActions.map((action) => (
              <Pressable
                key={action.route}
                accessibilityRole="button"
                onPress={() => navigation.navigate(action.route)}
                style={styles.action}
                testID={`home-${action.route}`}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon} size={20} color={colors.primaryDark} />
                </View>
                <Text style={styles.actionLabel}>{action.title}</Text>
              </Pressable>
            ))}
          </View>

          {nextBooking ? (
            <View style={styles.section}>
              <SectionHeader title="Next game" actionLabel="See all" onActionPress={() => navigation.navigate('MyBookings')} />
              <BookingCard booking={nextBooking} onPress={() => navigation.navigate('MyBookings')} />
            </View>
          ) : null}

          <View style={styles.section}>
            <SectionHeader title="Play by sport" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sportRow}>
              {sports.map((sport) => (
                <Pressable
                  key={sport}
                  accessibilityRole="button"
                  onPress={() => openSport(sport)}
                  style={styles.sportTile}
                >
                  <View style={styles.sportIcon}>
                    <Ionicons name={sportIcons[sport]} size={22} color={colors.primaryDark} />
                  </View>
                  <Text style={styles.sportLabel}>{sport}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Featured fields" actionLabel="Browse" onActionPress={() => navigation.navigate('SearchFields')} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
            {featuredFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                layout="featured"
                onPress={() => navigation.navigate('FieldDetails', { fieldId: field.id })}
              />
            ))}
          </ScrollView>

          <View style={[styles.section, styles.benefits]}>
            <SectionHeader title="Why Play More" />
            {benefits.map((benefit) => (
              <View key={benefit.title} style={styles.benefit}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={benefit.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.benefitCopy}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.sm,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  brand: {
    ...typography.caption,
    color: colors.primaryMuted,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  greeting: {
    ...typography.caption,
    color: colors.white,
    marginTop: spacing.lg,
  },
  name: {
    ...typography.hero,
    marginTop: 2,
  },
  tagline: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.88)',
    marginTop: spacing.sm,
  },
  search: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.soft,
  },
  searchText: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  body: {
    marginTop: -spacing.xl,
    gap: spacing.xl,
  },
  actionsCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    ...shadows.card,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  sportRow: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  sportTile: {
    width: 104,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.soft,
  },
  sportIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  featuredRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  benefits: {
    marginBottom: spacing.md,
  },
  benefit: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitCopy: {
    flex: 1,
    gap: 2,
  },
  benefitTitle: {
    ...typography.bodyStrong,
  },
  benefitText: {
    ...typography.caption,
  },
});
