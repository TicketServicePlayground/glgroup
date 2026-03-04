const PREVIEW_TTL = 5 * 60 * 1000; // 5 minutes

class PreviewStore {
  constructor() {
    if (!global.__previewStore) {
      global.__previewStore = new Map();
    }
    this.cache = global.__previewStore;
  }

  set(token, data) {
    this.cleanup();
    this.cache.set(token, { ...data, createdAt: Date.now() });
  }

  get(token) {
    const entry = this.cache.get(token);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > PREVIEW_TTL) {
      this.cache.delete(token);
      return null;
    }
    return entry;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (now - value.createdAt > PREVIEW_TTL) {
        this.cache.delete(key);
      }
    }
  }
}

export const previewStore = new PreviewStore();
