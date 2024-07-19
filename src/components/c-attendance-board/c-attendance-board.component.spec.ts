import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAttendanceBoardComponent } from './c-attendance-board.component';

describe('CAttendanceBoardComponent', () => {
  let component: CAttendanceBoardComponent;
  let fixture: ComponentFixture<CAttendanceBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CAttendanceBoardComponent],
    });
    fixture = TestBed.createComponent(CAttendanceBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
