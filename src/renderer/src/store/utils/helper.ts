import { del, get, set } from "idb-keyval"
import { enableMapSet } from "immer"
import superjson from "superjson" //  can use anything: serialize-javascript, devalue, etc.
import type { StateCreator } from "zustand"
import type { PersistOptions, StateStorage } from "zustand/middleware"
import { persist } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

export const dbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const data = (await get(name)) || null

    if (data === null) {
      return null
    }

    return superjson.parse(data)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, superjson.stringify(value))
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}
enableMapSet()
export const zustandStorage = dbStorage

export const createZustandStore =
  <
    S,
    T extends StateCreator<
      S,
      [["zustand/persist", unknown]],
      []
    > = StateCreator<S, [["zustand/persist", unknown]], []>,
  >(
    name: string,
    options?: Partial<PersistOptions<S>>,
  ) =>
    (store: T) => {
      const newStore = createWithEqualityFn(
        persist<S>(store, {
          name,
          storage: zustandStorage,
          ...options,
        }),
        shallow,
      )

      Object.assign(window, {
        [`__${name}`]() {
          return newStore.getState()
        },
      })
      return newStore
    }
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T]

type FunctionProps<T> = Pick<T, FunctionKeys<T>>
export const getStoreActions = <T extends { getState: () => any }>(
  store: T,
): FunctionProps<ReturnType<T["getState"]>> => {
  const actions = {}
  const state = store.getState()
  for (const key in state) {
    if (typeof state[key] === "function") {
      actions[key] = state[key]
    }
  }

  return actions as any
}
