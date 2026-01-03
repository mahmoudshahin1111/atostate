
export interface PersistOptions<S> {
  serialize?: (s: S) => string;
  deserialize?: (raw: string) => Partial<S>;
  storage?: Pick<Storage, "getItem" | "setItem">; // allow custom storage for tests
}