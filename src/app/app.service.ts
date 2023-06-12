import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  /**
   *
   * @param key
   * @param value
   */
  tempStoreKey(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  /**
   *
   * @param key
   * @returns
   */
  tempGetKey(key: string): string | null {
    return localStorage.getItem(key);
  }
  /**
   * Rturns application title.
   */
  get appTitle(): string {
    return '位置確認リアルタイムシステム';
  }
}
