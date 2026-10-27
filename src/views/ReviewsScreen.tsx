import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RatingStars } from '../components/RatingStars';
import { formatDisplayDate, formatRating, getInitials } from '../constants/format';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { ReviewModel } from '../models/ReviewModel';
import { RootStackParamList } from '../navigation/types';
import { useReviewsViewModel } from '../viewmodels/ReviewViewModel';

type ReviewsProps = NativeStackScreenProps<RootStackParamList, 'Reviews'>;

export function ReviewsScreen({ route }: ReviewsProps) {
  const viewModel = useReviewsViewModel(route.params?.fieldId);
  const insets = useSafeAreaInsets();
  const { reviews, heading, average, distribution } = viewModel.state;
  const maxCount = Math.max(...distribution, 1);

  return (
    <View style={styles.screen} testID="screen-reviews">
      <StatusBar style="dark" />
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>{heading}</Text>
            <View style={styles.summary}>
              <View style={styles.scoreBlock}>
                <Text style={styles.score}>{formatRating(average)}</Text>
                <RatingStars rating={average} size={16} />
                <Text style={styles.count}>{reviews.length} reviews</Text>
              </View>
              <View style={styles.bars}>
                {distribution.map((count, index) => {
                  const star = 5 - index;
                  return (
                    <View key={star} style={styles.barRow}>
                      <Text style={styles.barLabel}>{star}</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${(count / maxCount) * 100}%` }]} />
                      </View>
                      <Text style={styles.barCount}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => <ReviewCard review={item} />}
      />
    </View>
  );
}

function ReviewCard({ review }: { review: ReviewModel }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(review.authorName)}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.author}>{review.authorName}</Text>
          <Text style={styles.date}>{formatDisplayDate(review.date)}</Text>
        </View>
        <RatingStars rating={review.rating} />
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
      <Text style={styles.field}>{review.fieldName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.xl,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  heading: {
    ...typography.title,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.lg,
    ...shadows.card,
  },
  scoreBlock: {
    width: 96,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  score: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    color: colors.text,
  },
  count: {
    ...typography.caption,
  },
  bars: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barLabel: {
    ...typography.caption,
    width: 12,
    color: colors.text,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  barCount: {
    ...typography.caption,
    width: 16,
    textAlign: 'right',
  },
  separator: {
    height: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.soft,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
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
  meta: {
    flex: 1,
  },
  author: {
    ...typography.bodyStrong,
  },
  date: {
    ...typography.caption,
  },
  comment: {
    ...typography.body,
    color: colors.textSecondary,
  },
  field: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
