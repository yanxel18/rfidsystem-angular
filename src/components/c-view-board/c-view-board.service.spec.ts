import { TestBed } from '@angular/core/testing';

import { CViewBoardService } from './c-view-board.service';

describe('CViewBoardService', () => {
  let service: CViewBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CViewBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
