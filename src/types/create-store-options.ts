import { Middleware } from "./middleware";
import { Reducer } from "./reducer";

export interface CreateStoreOptions<S, A> {
  reducer?: Reducer<S, A> | null;
  middleware?: Array<Middleware<S, A>>;
  batch?: boolean; // batch multiple updates per microtask
}