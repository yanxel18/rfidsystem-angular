import { TestBed } from '@angular/core/testing';

import { CDialogCommentService } from './c-dialog-comment.service';

describe('CDialogCommentService', () => {
  let service: CDialogCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CDialogCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
