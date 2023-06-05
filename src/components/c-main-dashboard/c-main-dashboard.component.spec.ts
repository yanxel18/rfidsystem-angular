import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMainDashboardComponent } from './c-main-dashboard.component';

describe('CMainDashboardComponent', () => {
  let component: CMainDashboardComponent;
  let fixture: ComponentFixture<CMainDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CMainDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CMainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
