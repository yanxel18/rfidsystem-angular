import { TestBed } from '@angular/core/testing';

import { CAttendanceBoardService } from './c-attendance-board.service';

describe('CAttendanceBoardService', () => {
  let service: CAttendanceBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CAttendanceBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
