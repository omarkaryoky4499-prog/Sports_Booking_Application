import { useEffect, useState } from 'react';

import { ViewModel } from './ViewModel';

/** Re-render the screen whenever the view model publishes a state change. */
export function useViewModelSubscription<TState>(viewModel: ViewModel<TState>): void {
  const [, setTick] = useState(0);

  useEffect(() => {
    return viewModel.subscribe(() => {
      setTick((tick) => tick + 1);
    });
  }, [viewModel]);
}
