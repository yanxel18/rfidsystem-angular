import { CBurgerComponent } from './../components/c-burger/c-burger.component';
import { AppService } from './app.service';
import {MediaMatcher} from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent  {
  mobileQuery: MediaQueryList;
  yearNow = (new Date()).getFullYear();
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
 
  @ViewChild(CBurgerComponent) BurgerComponent!: CBurgerComponent;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  retriggerBurger(): void{ 
    this.BurgerComponent.active = true;
    this.BurgerComponent.onBurgerClicked();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
