import { Store } from './store';

export type Middleware<S, A> = (store: Store<S, A>) => Store<S, A> | void;
