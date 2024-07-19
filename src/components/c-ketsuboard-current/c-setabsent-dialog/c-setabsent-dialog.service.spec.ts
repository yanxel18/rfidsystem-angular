import { TestBed } from '@angular/core/testing';

import { CSetabsentDialogService } from './c-setabsent-dialog.service';

describe('CSetabsentDialogService', () => {
  let service: CSetabsentDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CSetabsentDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
