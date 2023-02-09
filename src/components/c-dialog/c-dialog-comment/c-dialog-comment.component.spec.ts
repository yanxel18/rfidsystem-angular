import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDialogCommentComponent } from './c-dialog-comment.component';

describe('CDialogCommentComponent', () => {
  let component: CDialogCommentComponent;
  let fixture: ComponentFixture<CDialogCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDialogCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDialogCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
