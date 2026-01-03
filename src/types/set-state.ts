export type SetState<S> = Partial<S> | ((prev: S) => S);
