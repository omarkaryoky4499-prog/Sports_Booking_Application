import { useMemo } from 'react';

import { FieldModel, FieldSearchFilters, isSportType, PriceOption, SportType } from '../models/FieldModel';
import { fieldService } from '../services/fieldService';
import { useViewModelSubscription } from './useViewModelSubscription';
import { ViewModel } from './ViewModel';

export const PRICE_OPTIONS: PriceOption[] = [
  { label: 'Any price', value: null },
  { label: 'Up to 300', value: 300 },
  { label: 'Up to 400', value: 400 },
  { label: 'Up to 500', value: 500 },
];

export interface FieldState {
  query: string;
  sport: SportType | 'All';
  area: string;
  maxPrice: number | null;
  sports: string[];
  areas: string[];
  priceOptions: PriceOption[];
  results: FieldModel[];
  selectedField: FieldModel | null;
}

function createFieldState(): FieldState {
  return {
    query: '',
    sport: 'All',
    area: 'All',
    maxPrice: null,
    sports: ['All', ...fieldService.getSports()],
    areas: ['All', ...fieldService.getAreas()],
    priceOptions: PRICE_OPTIONS,
    results: [],
    selectedField: null,
  };
}

export class FieldViewModel extends ViewModel<FieldState> {
  constructor() {
    super(createFieldState());
  }

  setQuery = (query: string): void => {
    this.setState({ query });
  };

  setSport = (sport: string): void => {
    this.setState({ sport: isSportType(sport) ? sport : 'All' });
  };

  setArea = (area: string): void => {
    this.setState({ area });
  };

  setMaxPrice = (maxPrice: number | null): void => {
    this.setState({ maxPrice });
  };

  toFilters(): FieldSearchFilters {
    return {
      query: this.state.query.trim(),
      sport: this.state.sport,
      area: this.state.area,
      maxPrice: this.state.maxPrice,
    };
  }

  applyFilters = (filters: FieldSearchFilters): void => {
    const sport = filters.sport === 'All' || isSportType(filters.sport) ? filters.sport : 'All';
    const normalized: FieldSearchFilters = {
      query: filters.query.trim(),
      sport,
      area: filters.area || 'All',
      maxPrice: filters.maxPrice,
    };
    this.setState({
      ...normalized,
      results: fieldService.search(normalized),
    });
  };

  loadField = (fieldId: string): void => {
    this.setState({
      selectedField: fieldService.getById(fieldId) ?? null,
    });
  };

  get resultSummary(): string {
    const count = this.state.results.length;
    const label = count === 1 ? 'field' : 'fields';
    const active = this.activeFilterLabels();
    return active.length > 0 ? `${count} ${label} · ${active.join(' · ')}` : `${count} ${label} in Cairo`;
  }

  private activeFilterLabels(): string[] {
    const labels: string[] = [];
    const trimmedQuery = this.state.query.trim();

    if (trimmedQuery) {
      labels.push(`“${trimmedQuery}”`);
    }
    if (this.state.sport !== 'All') {
      labels.push(this.state.sport);
    }
    if (this.state.area !== 'All') {
      labels.push(this.state.area);
    }
    if (this.state.maxPrice != null) {
      labels.push(`up to ${this.state.maxPrice} EGP`);
    }

    return labels;
  }
}

export function useFieldSearchViewModel(): FieldViewModel {
  const viewModel = useMemo(() => new FieldViewModel(), []);
  useViewModelSubscription(viewModel);
  return viewModel;
}

export function useFieldsListViewModel(filters: FieldSearchFilters): FieldViewModel {
  const viewModel = useMemo(() => {
    const vm = new FieldViewModel();
    vm.applyFilters(filters);
    return vm;
  }, [filters.query, filters.sport, filters.area, filters.maxPrice]);
  useViewModelSubscription(viewModel);
  return viewModel;
}

export function useFieldDetailsViewModel(fieldId: string): FieldViewModel {
  const viewModel = useMemo(() => {
    const vm = new FieldViewModel();
    vm.loadField(fieldId);
    return vm;
  }, [fieldId]);
  useViewModelSubscription(viewModel);
  return viewModel;
}
