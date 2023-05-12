import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  tempStoreKey(key: string,value: string): void {
    localStorage.setItem(key,value)
  }

  tempGetKey(key: string): string | null{
    return localStorage.getItem(key)
  }
}
