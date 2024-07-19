import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAttendanceStatsComponent } from './c-attendance-stats.component';

describe('CAttendanceStatsComponent', () => {
  let component: CAttendanceStatsComponent;
  let fixture: ComponentFixture<CAttendanceStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CAttendanceStatsComponent],
    });
    fixture = TestBed.createComponent(CAttendanceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
