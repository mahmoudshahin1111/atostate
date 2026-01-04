import { createStore, shallowEqual, loggerMiddleware } from '../src';

type State = {
  count: number;
  user: { id: string; name: string } | null;
};

describe('atostate', () => {
  test('creates a store with initial state', () => {
    const store = createStore<State>({ count: 0, user: null });

    expect(store.getState()).toEqual({
      count: 0,
      user: null,
    });
  });

  test('setState updates state (object)', () => {
    const store = createStore<State>({ count: 0, user: null });

    store.setState({ count: 1 });

    expect(store.getState().count).toBe(1);
  });

  test('setState updates state (function)', () => {
    const store = createStore<State>({ count: 1, user: null });

    store.setState((s) => ({ ...s, count: s.count + 1 }));

    expect(store.getState().count).toBe(2);
  });

  test('subscribe triggers on state change', async () => {
    const store = createStore<State>({ count: 0, user: null });
    const spy = jest.fn();

    store.subscribe(spy);
    store.setState({ count: 1 });

    await Promise.resolve(); // wait microtask

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('unsubscribe stops notifications', () => {
    const store = createStore<State>({ count: 0, user: null });
    const spy = jest.fn();

    const unsubscribe = store.subscribe(spy);
    unsubscribe();

    store.setState({ count: 1 });

    expect(spy).not.toHaveBeenCalled();
  });

  test('selector subscription fires only on slice change', async () => {
    const store = createStore<State>({ count: 0, user: null });
    const spy = jest.fn();

    store.subscribe((s) => s.count, spy);

    store.setState({ user: { id: '1', name: 'Mahmoud' } });
    store.setState({ count: 1 });

    await Promise.resolve(); // wait microtask

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 0);
  });

  test('custom equality function works', async () => {
    const store = createStore<State>({
      count: 0,
      user: { id: '1', name: 'Mahmoud' },
    });

    const spy = jest.fn();

    store.subscribe((s) => s.user, spy);

    store.setState({
      user: { id: '1', name: 'Mahmoud' },
    });

    store.setState({
      user: { id: '1', name: 'Ali' },
    });

    await Promise.resolve(); // wait microtask

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('actions API updates state', () => {
    const store = createStore<State>({ count: 0, user: null });

    const counter = store.actions(({ setState }) => ({
      inc() {
        setState((s) => ({ ...s, count: s.count + 1 }));
      },
    }));

    counter.inc();
    counter.inc();

    expect(store.getState().count).toBe(2);
  });

  test('reducer + dispatch works', () => {
    type Action = { type: 'inc' } | { type: 'set'; value: number };

    const reducer = (state: State, action: Action): State => {
      switch (action.type) {
        case 'inc':
          return { ...state, count: state.count + 1 };
        case 'set':
          return { ...state, count: action.value };
        default:
          return state;
      }
    };

    const store = createStore<State, Action>(
      { count: 0, user: null },
      { reducer },
    );

    store.dispatch({ type: 'inc' });
    store.dispatch({ type: 'set', value: 10 });

    expect(store.getState().count).toBe(10);
  });

  test('middleware does not break store', () => {
    const store = createStore<State>(
      { count: 0, user: null },
      { middleware: [loggerMiddleware<State>('test')] },
    );

    store.setState({ count: 1 });

    expect(store.getState().count).toBe(1);
  });

  test('batched updates notify once', async () => {
    const store = createStore<State>({ count: 0, user: null });
    const spy = jest.fn();

    store.subscribe(spy);

    store.setState({ count: 1 });
    store.setState({ count: 2 });

    await Promise.resolve(); // wait microtask

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
