import {
  Store,
  Listener,
  CreateStoreOptions,
  SetState,
  Unsubscribe,
  Selector,
  SliceListener,
  EqualityFn,
} from "../types/index";

export function createStore<S extends object, A = unknown>(
  initialState: S,
  options: CreateStoreOptions<S, A> = {}
): Store<S, A> {
  const { reducer = null, middleware = [], batch = true } = options;

  let state: S = initialState;
  const listeners = new Set<Listener>();

  // batching internals
  let scheduled = false;
  let changedInBatch = false;

  function getState(): S {
    return state;
  }

  function notify(): void {
    for (const l of listeners) l();
  }

  function scheduleNotify(): void {
    if (!batch) {
      notify();
      return;
    }

    changedInBatch = true;
    if (scheduled) return;

    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      if (changedInBatch) {
        changedInBatch = false;
        notify();
      }
    });
  }

  function setState(next: SetState<S>): void {
    const nextState: S =
      typeof next === "function"
        ? (next as (prev: S) => S)(state)
        : ({ ...state, ...next } as S);

    if (Object.is(nextState, state)) return;

    state = nextState;
    scheduleNotify();
  }

  function dispatch(action: A): void {
    if (!reducer) {
      throw new Error(
        "dispatch() requires a reducer passed to createStore({ reducer })"
      );
    }
    const nextState = reducer(state, action);
    if (Object.is(nextState, state)) return;

    state = nextState;
    scheduleNotify();
  }

  function actions<T extends Record<string, (...args: any[]) => any>>(
    factory: (api: Pick<Store<S, A>, "getState" | "setState" | "dispatch">) => T
  ): T {
    return factory({ getState, setState, dispatch });
  }

  function subscribe(arg1: any, arg2?: any, arg3?: any): Unsubscribe {
    // subscribe(listener)
    if (typeof arg2 !== "function") {
      const rawListener = arg1 as Listener;
      listeners.add(rawListener);
      return () => listeners.delete(rawListener);
    }

    // subscribe(selector, listener, equality?)
    const selector = arg1 as Selector<S, unknown>;
    const listener = arg2 as SliceListener<unknown>;
    const equality = (arg3 as EqualityFn<unknown> | undefined) ?? Object.is;

    let prevSlice = selector(state);

    const wrapped: Listener = () => {
      const nextSlice = selector(state);
      if (!equality(nextSlice, prevSlice)) {
        const old = prevSlice;
        prevSlice = nextSlice;
        listener(nextSlice, old);
      }
    };

    listeners.add(wrapped);
    return () => listeners.delete(wrapped);
  }

  // base store
  let store: Store<S, A> = {
    getState,
    setState,
    subscribe: subscribe as Store<S, A>["subscribe"],
    dispatch,
    actions,
  };

  // apply middleware
  for (const mw of middleware) {
    const maybe = mw(store);
    if (maybe) store = maybe;
  }

  return store;
}
