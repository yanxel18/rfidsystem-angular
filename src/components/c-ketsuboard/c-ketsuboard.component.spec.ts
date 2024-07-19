import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CKetsuboardComponent } from './c-ketsuboard.component';

describe('CKetsuboardComponent', () => {
  let component: CKetsuboardComponent;
  let fixture: ComponentFixture<CKetsuboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CKetsuboardComponent],
    });
    fixture = TestBed.createComponent(CKetsuboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
