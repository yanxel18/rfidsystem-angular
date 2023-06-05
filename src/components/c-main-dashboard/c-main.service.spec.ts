import { TestBed } from '@angular/core/testing';

import { CMainService } from './c-main.service';

fdescribe('CMainService', () => {
  let service: CMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
