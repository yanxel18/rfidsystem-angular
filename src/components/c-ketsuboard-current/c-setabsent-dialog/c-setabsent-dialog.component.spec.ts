import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSetabsentDialogComponent } from './c-setabsent-dialog.component';

describe('CSetabsentDialogComponent', () => {
  let component: CSetabsentDialogComponent;
  let fixture: ComponentFixture<CSetabsentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CSetabsentDialogComponent],
    });
    fixture = TestBed.createComponent(CSetabsentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
