import { TestBed } from '@angular/core/testing';

import { ParseZodService } from './parse-zod.service';

describe('ParseZodService', () => {
  let service: ParseZodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseZodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
