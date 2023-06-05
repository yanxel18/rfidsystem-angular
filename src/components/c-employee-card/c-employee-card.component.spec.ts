import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CEmployeeCardComponent } from './c-employee-card.component';

describe('CEmployeeCardComponent', () => {
  let component: CEmployeeCardComponent;
  let fixture: ComponentFixture<CEmployeeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CEmployeeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CEmployeeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
