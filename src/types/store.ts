import { Selector } from './selector';
import { EqualityFn } from './equality-fn';
import { Unsubscribe } from './unsubscribe';
import { Listener, SliceListener } from './listeners';
import { SetState } from './set-state';

export interface Store<S, A = unknown> {
  getState(): S;
  setState(next: SetState<S>): void;
  subscribe(listener: Listener): Unsubscribe;
  subscribe<Slice>(
    selector: Selector<S, Slice>,
    listener: SliceListener<Slice>,
    equality?: EqualityFn<Slice>
  ): Unsubscribe;
  dispatch(action: A): void;
  actions<T extends Record<string, (...args: any[]) => any>>(
    factory: (api: Pick<Store<S, A>, "getState" | "setState" | "dispatch">) => T
  ): T;
}
