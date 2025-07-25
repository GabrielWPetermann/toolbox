// Simple in-memory storage for URLs
// In production, this should be replaced with a database like Redis, PostgreSQL, etc.

class URLStorage {
  constructor() {
    if (!URLStorage.instance) {
      this.urls = new Map();
      URLStorage.instance = this;
    }
    return URLStorage.instance;
  }

  set(shortCode, originalUrl) {
    this.urls.set(shortCode, originalUrl);
  }

  get(shortCode) {
    return this.urls.get(shortCode);
  }

  has(shortCode) {
    return this.urls.has(shortCode);
  }

  delete(shortCode) {
    return this.urls.delete(shortCode);
  }

  size() {
    return this.urls.size;
  }
}

// Create singleton instance
const urlStorage = new URLStorage();

export default urlStorage;
