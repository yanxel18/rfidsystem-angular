import { TestBed } from '@angular/core/testing';

import { CKetsuboardCurrentService } from './c-ketsuboard-current.service';

describe('CKetsuboardCurrentService', () => {
  let service: CKetsuboardCurrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CKetsuboardCurrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
