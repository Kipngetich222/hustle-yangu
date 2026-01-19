// lib/storage.ts
class StorageService {
  private prefix = 'hustlehub_';

  // Local Storage
  setLocal(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${this.prefix}${key}`, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getLocal<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  removeLocal(key: string): void {
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  clearLocal(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Session Storage
  setSession(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(`${this.prefix}${key}`, serializedValue);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  getSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(`${this.prefix}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return null;
    }
  }

  removeSession(key: string): void {
    sessionStorage.removeItem(`${this.prefix}${key}`);
  }

  clearSession(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  // Preferences
  setPreferences(prefs: any): void {
    this.setLocal('preferences', prefs);
  }

  getPreferences(): any {
    return this.getLocal('preferences') || {};
  }

  // Auth Token
  setToken(token: string): void {
    this.setSession('token', token);
  }

  getToken(): string | null {
    return this.getSession('token');
  }

  removeToken(): void {
    this.removeSession('token');
  }

  // User Data
  setUser(user: any): void {
    this.setLocal('user', user);
  }

  getUser(): any {
    return this.getLocal('user');
  }

  removeUser(): void {
    this.removeLocal('user');
  }

  // Recent Searches
  addRecentSearch(search: string): void {
    const searches = this.getRecentSearches();
    const updated = [search, ...searches.filter(s => s !== search)].slice(0, 10);
    this.setLocal('recent_searches', updated);
  }

  getRecentSearches(): string[] {
    return this.getLocal('recent_searches') || [];
  }

  clearRecentSearches(): void {
    this.removeLocal('recent_searches');
  }

  // Job Filters
  saveJobFilters(filters: any): void {
    this.setLocal('job_filters', filters);
  }

  getJobFilters(): any {
    return this.getLocal('job_filters') || {};
  }

  // Theme
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.setLocal('theme', theme);
  }

  getTheme(): 'light' | 'dark' | 'system' {
    return this.getLocal('theme') || 'system';
  }

  // Location Settings
  setLocationSettings(settings: {
    enabled: boolean;
    lastLocation?: { lat: number; lng: number };
    radius: number;
  }): void {
    this.setLocal('location_settings', settings);
  }

  getLocationSettings(): {
    enabled: boolean;
    lastLocation?: { lat: number; lng: number };
    radius: number;
  } {
    return this.getLocal('location_settings') || {
      enabled: true,
      radius: 10
    };
  }

  // Cache Management
  setCache(key: string, value: any, ttl: number = 3600000): void {
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    this.setLocal(`cache_${key}`, item);
  }

  getCache<T>(key: string): T | null {
    const item = this.getLocal<{ value: T; expiry: number }>(`cache_${key}`);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.removeLocal(`cache_${key}`);
      return null;
    }
    
    return item.value;
  }

  clearExpiredCache(): void {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith(`${this.prefix}cache_`)) {
        try {
          const item = JSON.parse(localStorage.getItem(key)!);
          if (now > item.expiry) {
            localStorage.removeItem(key);
          }
        } catch {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Offline Data
  setOfflineData(key: string, data: any): void {
    this.setLocal(`offline_${key}`, {
      data,
      timestamp: Date.now()
    });
  }

  getOfflineData<T>(key: string): T | null {
    const item = this.getLocal<{ data: T; timestamp: number }>(`offline_${key}`);
    return item?.data || null;
  }

  // Clear all app data
  clearAll(): void {
    this.clearLocal();
    this.clearSession();
  }
}

export const storage = new StorageService();