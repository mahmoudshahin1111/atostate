import { Middleware } from "../types";

export function loggerMiddleware<S extends object, A = unknown>(label = "store"): Middleware<S, A> {
  return (store) => {
    let prev = store.getState();

    store.subscribe(() => {
      const next = store.getState();
      // eslint-disable-next-line no-console
      console.log(`[${label}]`, { prev, next });
      prev = next;
    });

    return store;
  };
}
