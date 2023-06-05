import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root',
})
export class AppService { 

  tempStoreKey(key: string,value: string): void {
    localStorage.setItem(key,value)
  }

  tempGetKey(key: string): string | null{
    return localStorage.getItem(key)
  }

  get appTitle(): string {
    return "位置確認リアルタイムシステム"
  }
}
