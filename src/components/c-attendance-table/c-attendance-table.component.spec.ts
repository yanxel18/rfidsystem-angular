import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAttendanceTableComponent } from './c-attendance-table.component';

describe('CAttendanceTableComponent', () => {
  let component: CAttendanceTableComponent;
  let fixture: ComponentFixture<CAttendanceTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CAttendanceTableComponent],
    });
    fixture = TestBed.createComponent(CAttendanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
