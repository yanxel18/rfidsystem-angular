import { TestBed } from '@angular/core/testing';

import { CKetsuboardService } from './c-ketsuboard.service';

describe('CKetsuboardService', () => {
  let service: CKetsuboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CKetsuboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
