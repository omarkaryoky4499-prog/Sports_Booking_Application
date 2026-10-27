import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { RatingStars } from '../components/RatingStars';
import { SectionHeader } from '../components/SectionHeader';
import { formatDisplayDate, formatHourlyPrice, formatRating, getInitials } from '../constants/format';
import { sportIcons } from '../constants/sports';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useFieldDetailsViewModel } from '../viewmodels/FieldViewModel';
import { useReviewsViewModel } from '../viewmodels/ReviewViewModel';

type FieldDetailsProps = NativeStackScreenProps<RootStackParamList, 'FieldDetails'>;

export function FieldDetailsScreen({ navigation, route }: FieldDetailsProps) {
  const fieldViewModel = useFieldDetailsViewModel(route.params.fieldId);
  const reviewViewModel = useReviewsViewModel(route.params.fieldId);
  const insets = useSafeAreaInsets();
  const field = fieldViewModel.state.selectedField;
  const preview = reviewViewModel.state.reviews.slice(0, 2);

  if (!field) {
    return (
      <View style={styles.missing}>
        <StatusBar style="dark" />
        <Text style={styles.missingTitle}>This field is unavailable</Text>
        <PrimaryButton title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.screen} testID="screen-details">
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: field.accentColor, paddingTop: insets.top + spacing.sm }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.sportPill}>
            <Ionicons name={sportIcons[field.sport]} size={14} color={colors.white} />
            <Text style={styles.sportPillText}>{field.sport}</Text>
          </View>
          <Text style={styles.heroTitle}>{field.name}</Text>
          <Text style={styles.heroMeta}>
            {field.area}, {field.city}
          </Text>
        </View>

        <View style={styles.sheet}>
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>Rating</Text>
              <RatingStars rating={field.rating} showValue size={16} />
              <Text style={styles.summaryHint}>
                {formatRating(field.rating)} from {field.reviewCount} reviews
              </Text>
            </View>
            <View style={styles.priceBlock}>
              <Text style={styles.summaryLabel}>From</Text>
              <Text style={styles.price}>{formatHourlyPrice(field.pricePerHour)}</Text>
            </View>
          </View>

          <View style={styles.facts}>
            <Fact icon="layers-outline" label="Surface" value={field.surface} />
            <Fact icon="people-outline" label="Capacity" value={field.capacity} />
            <Fact icon="time-outline" label="Hours" value={field.openingHours} />
          </View>

          <View style={styles.block}>
            <SectionHeader title="About" />
            <Text style={styles.body}>{field.description}</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.address}>{field.address}</Text>
            </View>
          </View>

          <View style={styles.block}>
            <SectionHeader title="Amenities" />
            <View style={styles.amenities}>
              {field.amenities.map((amenity) => (
                <View key={amenity} style={styles.amenity}>
                  <Ionicons name="checkmark" size={14} color={colors.primaryDark} />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <SectionHeader
              title="Reviews"
              actionLabel={reviewViewModel.state.reviews.length > 2 ? 'See all' : undefined}
              onActionPress={() => navigation.navigate('Reviews', { fieldId: field.id })}
            />
            {preview.map((review) => (
              <View key={review.id} style={styles.review}>
                <View style={styles.reviewTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(review.authorName)}</Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.author}>{review.authorName}</Text>
                    <Text style={styles.reviewDate}>{formatDisplayDate(review.date)}</Text>
                  </View>
                  <RatingStars rating={review.rating} />
                </View>
                <Text style={styles.comment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.footerLabel}>Hourly rate</Text>
          <Text style={styles.footerPrice}>{formatHourlyPrice(field.pricePerHour)}</Text>
        </View>
        <View style={styles.footerButton}>
          <PrimaryButton
            title="Book this field"
            onPress={() => navigation.navigate('Booking', { fieldId: field.id })}
            testID="book-field"
          />
        </View>
      </View>
    </View>
  );
}

function Fact({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
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
    textAlign: 'center',
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportPill: {
    alignSelf: 'flex-start',
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  sportPillText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  heroTitle: {
    ...typography.hero,
    marginTop: spacing.md,
  },
  heroMeta: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  sheet: {
    marginTop: -spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    ...shadows.card,
  },
  summaryLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  summaryHint: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.title,
    color: colors.primaryDark,
  },
  facts: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fact: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
    ...shadows.soft,
  },
  factLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  factValue: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  block: {
    gap: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  address: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  amenityText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  review: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.soft,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  reviewMeta: {
    flex: 1,
  },
  author: {
    ...typography.bodyStrong,
  },
  reviewDate: {
    ...typography.caption,
  },
  comment: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  footerLabel: {
    ...typography.caption,
  },
  footerPrice: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
  },
  footerButton: {
    flex: 1,
  },
});
