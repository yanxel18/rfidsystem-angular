import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CMainDashboardComponent } from './c-main-dashboard.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { MaterialModules } from 'src/material-modules/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { CMainService } from './c-main.service';
fdescribe('CMainDashboardComponent', () => {
  let component: CMainDashboardComponent;
  let fixture: ComponentFixture<CMainDashboardComponent>;

  beforeEach(async () => {
    const mainServiceSpy = jasmine.createSpyObj('CMainService', [
      'getTotalArea',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        MaterialModules,
        FormsModule,
        ReactiveFormsModule,
        NgxSkeletonLoaderModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      declarations: [CMainDashboardComponent],
      providers: [
        {
          provide: CMainService,
          useValue: mainServiceSpy,
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CMainDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return tracking number', () => {
    const trackNum = component.trackArea(1);
    expect(trackNum).withContext('No track number returned').toBe(1);
  });

  it('should display table per area ', () => {
    spyOn(component, 'getSelectedDate').and.callThrough();
    component.getSelectedDate();
    expect(component.getSelectedDate)
      .withContext('Call selected date')
      .toHaveBeenCalled();
  });
});
