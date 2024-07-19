import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CKetsuboardCurrentComponent } from './c-ketsuboard-current.component';

describe('CKetsuboardCurrentComponent', () => {
  let component: CKetsuboardCurrentComponent;
  let fixture: ComponentFixture<CKetsuboardCurrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CKetsuboardCurrentComponent],
    });
    fixture = TestBed.createComponent(CKetsuboardCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
