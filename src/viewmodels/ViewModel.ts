type Listener = () => void;

export abstract class ViewModel<TState> {
  state: TState;
  private listeners = new Set<Listener>();

  constructor(initialState: TState) {
    this.state = initialState;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  protected setState(partial: Partial<TState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener();
    }
  }
}
