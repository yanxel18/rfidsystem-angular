import { Injectable } from '@angular/core';
import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AppRouteReuseStrategy extends RouteReuseStrategy {
  retrieve(): DetachedRouteHandle | null {
    return null;
  }

  shouldAttach(): boolean {
    return false;
  }

  shouldDetach(): boolean {
    return false;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig !== curr.routeConfig;
  }

  store(): void {
    return;
  }
}
