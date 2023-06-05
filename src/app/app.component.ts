import { Title } from "@angular/platform-browser";
import { CBurgerComponent } from "./../components/c-burger/c-burger.component";
import { AppService } from "./app.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"],
})
export class AppComponent {
  mobileQuery: MediaQueryList;
  yearNow = new Date().getFullYear();
  apptitle = "位置確認リアルタイムシステム";
  @ViewChild(CBurgerComponent) BurgerComponent!: CBurgerComponent;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private title: Title,
    private appService: AppService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.title.setTitle(this.appService.appTitle);
  }

  retriggerBurger(): void {
    this.BurgerComponent.active = true;
    this.BurgerComponent.onBurgerClicked();
  }
}
