import { TestBed } from '@angular/core/testing';

import { MsgServiceService } from './msg-service.service';

describe('MsgServiceService', () => {
  let service: MsgServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsgServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
