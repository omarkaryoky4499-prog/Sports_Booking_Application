import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FieldCard } from '../components/FieldCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { isSportType } from '../models/FieldModel';
import { colors, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useFieldsListViewModel } from '../viewmodels/FieldViewModel';

type FieldsListProps = NativeStackScreenProps<RootStackParamList, 'FieldsList'>;

export function FieldsListScreen({ navigation, route }: FieldsListProps) {
  const viewModel = useFieldsListViewModel({
    query: route.params.query,
    sport: isSportType(route.params.sport) ? route.params.sport : 'All',
    area: route.params.area,
    maxPrice: route.params.maxPrice,
  });
  const insets = useSafeAreaInsets();
  const results = viewModel.state.results;

  return (
    <View style={styles.screen} testID="screen-fields">
      <StatusBar style="dark" />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing.xl },
          results.length === 0 && styles.emptyList,
        ]}
        ListHeaderComponent={<Text style={styles.summary}>{viewModel.resultSummary}</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <FieldCard field={item} onPress={() => navigation.navigate('FieldDetails', { fieldId: item.id })} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search" size={22} color={colors.primaryDark} />
            </View>
            <Text style={styles.emptyTitle}>No fields match this search</Text>
            <Text style={styles.emptyCopy}>Try another sport, area, or a higher budget.</Text>
            <PrimaryButton title="Adjust search" onPress={() => navigation.goBack()} variant="outline" />
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
  list: {
    padding: spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  summary: {
    ...typography.caption,
    marginBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xxxl,
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
    marginBottom: spacing.lg,
  },
});
