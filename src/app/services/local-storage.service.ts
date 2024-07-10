import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Set an item
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Get an item
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Remove an item
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items
  clear(): void {
    localStorage.clear();
  }
}
