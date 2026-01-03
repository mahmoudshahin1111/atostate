import { PersistOptions, Middleware } from "../types/index";

/**
 * Persist partial/full state to storage (default: localStorage).
 * Safe to include even in SSR if you provide a custom storage or gate it.
 */
export function persistMiddleware<S extends object, A = unknown>(
  key: string,
  opts: PersistOptions<S> = {}
): Middleware<S, A> {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    storage = typeof localStorage !== "undefined" ? localStorage : undefined,
  } = opts;

  return (store) => {
    if (!storage) return store;

    // hydrate once
    try {
      const raw = storage.getItem(key);
      if (raw != null) store.setState(deserialize(raw) as Partial<S>);
    } catch {
      // ignore
    }

    // save on changes
    store.subscribe(() => {
      try {
        storage.setItem(key, serialize(store.getState()));
      } catch {
        // ignore
      }
    });

    return store;
  };
}
