const memoryStore = new Map<string, string>();

function getStore() {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  return {
    getItem(key: string) {
      return memoryStore.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      memoryStore.set(key, value);
    },
    removeItem(key: string) {
      memoryStore.delete(key);
    },
    clear() {
      memoryStore.clear();
    },
    key(index: number) {
      return Array.from(memoryStore.keys())[index] ?? null;
    },
    get length() {
      return memoryStore.size;
    },
  } satisfies Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear" | "key" | "length">;
}

const AsyncStorage = {
  async getItem(key: string) {
    return getStore().getItem(key);
  },
  async setItem(key: string, value: string) {
    getStore().setItem(key, value);
  },
  async removeItem(key: string) {
    getStore().removeItem(key);
  },
  async clear() {
    getStore().clear();
  },
  async getAllKeys() {
    const store = getStore();
    const keys: string[] = [];
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i);
      if (key) keys.push(key);
    }
    return keys;
  },
  async multiGet(keys: string[]) {
    return Promise.all(keys.map(async (key) => [key, await AsyncStorage.getItem(key)] as const));
  },
  async multiSet(entries: Array<[string, string]>) {
    await Promise.all(entries.map(([key, value]) => AsyncStorage.setItem(key, value)));
  },
  async multiRemove(keys: string[]) {
    await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
  },
};

export default AsyncStorage;
export { AsyncStorage };

export function useAsyncStorage(key: string) {
  return {
    getItem: () => AsyncStorage.getItem(key),
    setItem: (value: string) => AsyncStorage.setItem(key, value),
    removeItem: () => AsyncStorage.removeItem(key),
  };
}
