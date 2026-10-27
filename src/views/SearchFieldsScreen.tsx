import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radius, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useFieldSearchViewModel } from '../viewmodels/FieldViewModel';

type SearchProps = NativeStackScreenProps<RootStackParamList, 'SearchFields'>;

export function SearchFieldsScreen({ navigation }: SearchProps) {
  const viewModel = useFieldSearchViewModel();
  const insets = useSafeAreaInsets();
  const { query, sport, area, maxPrice, sports, areas, priceOptions } = viewModel.state;

  const submit = () => {
    navigation.navigate('FieldsList', viewModel.toFilters());
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        testID="screen-search"
      >
        <Text style={styles.intro}>Find a venue by name, sport, neighbourhood, or budget.</Text>

        <Text style={styles.label}>Field or area</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={18} color={colors.primaryDark} />
          <TextInput
            value={query}
            onChangeText={viewModel.setQuery}
            placeholder="Cairo Stadium, Maadi, padel..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={submit}
            autoCorrect={false}
            testID="search-query"
          />
        </View>

        <Text style={styles.label}>Sport</Text>
        <View style={styles.chips}>
          {sports.map((option) => (
            <ChoiceChip key={option} label={option} selected={sport === option} onPress={() => viewModel.setSport(option)} />
          ))}
        </View>

        <Text style={styles.label}>Area</Text>
        <View style={styles.chips}>
          {areas.map((option) => (
            <ChoiceChip key={option} label={option} selected={area === option} onPress={() => viewModel.setArea(option)} />
          ))}
        </View>

        <Text style={styles.label}>Price per hour</Text>
        <View style={styles.chips}>
          {priceOptions.map((option) => (
            <ChoiceChip
              key={option.label}
              label={option.label}
              selected={maxPrice === option.value}
              onPress={() => viewModel.setMaxPrice(option.value)}
            />
          ))}
        </View>

        <View style={styles.submit}>
          <PrimaryButton title="Find fields" onPress={submit} testID="search-submit" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.md,
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
    color: colors.text,
    fontWeight: '700',
  },
  chipLabelSelected: {
    color: colors.white,
  },
  submit: {
    marginTop: spacing.xl,
  },
});
