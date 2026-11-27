// Safe wrapper around localStorage / sessionStorage.
// - JSON serialise / parse
// - namespaced keys + version prefix (change NS to invalidate old data)
// - try/catch: storage can throw (private mode, quota full, blocked cookies)
// - falls back to an in-memory Map so the app never crashes
const NS = 'sd:v1:';

const getStore = (name) => {
  try {
    const s = window[name];
    s.setItem('__t', '1'); s.removeItem('__t');   // feature test
    return s;
  } catch {
    return null;
  }
};

function createStorage(name) {
  const store = getStore(name);
  const memory = new Map();
  return {
    persistent: Boolean(store),
    get(key, fallback = null) {
      try {
        const raw = store ? store.getItem(NS + key) : memory.get(NS + key) ?? null;
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;                          // corrupted JSON -> fallback
      }
    },
    set(key, value) {
      const raw = JSON.stringify(value);
      try {
        if (store) store.setItem(NS + key, raw); else memory.set(NS + key, raw);
        return true;
      } catch {
        memory.set(NS + key, raw);                // quota exceeded -> memory
        return false;
      }
    },
    remove(key) {
      try { store ? store.removeItem(NS + key) : memory.delete(NS + key); } catch { /* ignore */ }
    },
    clear() {
      try {
        if (store) Object.keys(store).filter((k) => k.startsWith(NS)).forEach((k) => store.removeItem(k));
        memory.clear();
      } catch { /* ignore */ }
    },
  };
}

export const local = createStorage('localStorage');      // survives browser restart
export const session = createStorage('sessionStorage');  // cleared when the tab closes
export const STORAGE_NS = NS;
