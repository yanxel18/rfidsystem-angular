import { ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { CMainDashboardComponent } from "./c-main-dashboard.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import { MaterialModules } from "src/material-modules/material-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  IPerAreaTotalStatistics,
  ITotalArea,
} from "src/models/viewboard-model";
import { mainServiceData } from "src/test-data/total-area-data";
import { CMainService } from "./c-main.service";
import { of } from "rxjs";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
fdescribe("CMainDashboardComponent", () => {
  let component: CMainDashboardComponent;
  let fixture: ComponentFixture<CMainDashboardComponent>;
  let mainService: any;
  let el: DebugElement
  const TotalArea: IPerAreaTotalStatistics = mainServiceData;
  const PieArea: ITotalArea[] = mainServiceData.TotalArea;

  beforeEach(async () => {
    const mainServiceSpy = jasmine.createSpyObj("CMainService", [
      "getTotalArea",
    ]);
    await TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        MaterialModules,
        FormsModule,
        ReactiveFormsModule,
        NgxSkeletonLoaderModule,
        BrowserAnimationsModule,
      ],
      declarations: [CMainDashboardComponent],
      providers: [
        {
          provide: CMainService,
          useValue: mainServiceSpy,
        },
      ],
    }).compileComponents().then( () => {
      fixture = TestBed.createComponent(CMainDashboardComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      fixture.detectChanges();
      mainService = TestBed.inject(CMainService);
    });


  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return tracking number", () => {
    const trackNum = component.trackArea(1);
    expect(trackNum).withContext("No track number returned").toBe(1);
  });

  it("should display table per area ", fakeAsync(() => { 
    // Promise.resolve().then( () => {
    //   mainService.getTotalArea.and.returnValue(of(TotalArea));
    // });
    
    // fixture.detectChanges();
    const tableHeader = el.queryAll(By.css("dashboard-toolbar-title"));
    console.log(tableHeader)
  }));
});
