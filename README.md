# Atostate

> A tiny, framework-agnostic state management library for JavaScript and TypeScript.

**Atostate** provides a simple, predictable global store with subscriptions, selectors, middleware, and optional reducer-based updates without the complexity or boilerplate of large state libraries.

---

## Features

* ✅ Single global store
* ✅ TypeScript-first, fully typed
* ✅ Selective subscriptions via selectors
* ✅ Custom equality checks
* ✅ Optional reducer / dispatch pattern
* ✅ Middleware support
* ✅ Batched updates (microtask-based)
* ✅ Framework-agnostic (React, Vue, Vanilla JS)

---

## Installation

```bash
npm install atostate
```

or

```bash
yarn add atostate
```

---

## Basic Usage

### Create a store

```ts
import { createStore } from "atostate";

type State = {
  count: number;
};

const store = createStore<State>({
  count: 0,
});
```

---

### Read state

```ts
store.getState(); // { count: 0 }
```

---

### Update state

```ts
store.setState({ count: 1 });

store.setState((prev) => ({
  ...prev,
  count: prev.count + 1,
}));
```

---

## Subscriptions

### Subscribe to all state changes

```ts
const unsubscribe = store.subscribe(() => {
  console.log("State changed:", store.getState());
});
```

---

### Subscribe to a slice (selector)

```ts
store.subscribe(
  (state) => state.count,
  (count, prev) => {
    console.log("Count changed:", prev, "→", count);
  }
);
```

---

### Custom equality comparison

```ts
import { shallowEqual } from "atostate";

store.subscribe(
  (state) => state.user,
  (user) => {
    console.log("User changed:", user);
  },
  shallowEqual
);
```

---

## Actions API

Group logic into reusable actions.

```ts
const counter = store.actions(({ setState }) => ({
  increment() {
    setState((s) => ({ ...s, count: s.count + 1 }));
  },
  reset() {
    setState({ count: 0 });
  },
}));

counter.increment();
counter.reset();
```

---

## Reducer / Dispatch (Optional)

For a Redux-style workflow.

```ts
type Action =
  | { type: "inc" }
  | { type: "set"; value: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "inc":
      return { ...state, count: state.count + 1 };
    case "set":
      return { ...state, count: action.value };
    default:
      return state;
  }
}

const store = createStore<State, Action>(
  { count: 0 },
  { reducer }
);

store.dispatch({ type: "inc" });
```

---

## Middleware

### Logger

```ts
import { loggerMiddleware } from "atostate";

const store = createStore(
  { count: 0 },
  {
    middleware: [loggerMiddleware("app")],
  }
);
```

---

### Persistence (localStorage)

```ts
import { persistMiddleware } from "atostate";

const store = createStore(
  { count: 0 },
  {
    middleware: [
      persistMiddleware("app-state"),
    ],
  }
);
```

---

## Batching

State updates are **batched by default**.

```ts
store.setState({ count: 1 });
store.setState({ count: 2 });
// subscribers are notified once
```

Disable batching if needed:

```ts
createStore(initialState, { batch: false });
```

---

## Why atostate?

* Minimal API surface
* Predictable state updates
* No framework lock-in
* Easy to debug
* Easy to extend

Think of **atostate** as:

> **A smart global variable with rules, subscriptions, and guarantees**

---

## License

MIT

---
