import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CMainDashboardComponent } from "./c-main-dashboard.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import { MaterialModules } from "src/material-modules/material-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

fdescribe("CMainDashboardComponent", () => {
  let component: CMainDashboardComponent;
  let fixture: ComponentFixture<CMainDashboardComponent>;

  beforeEach(async () => {
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
    }).compileComponents();

    fixture = TestBed.createComponent(CMainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
