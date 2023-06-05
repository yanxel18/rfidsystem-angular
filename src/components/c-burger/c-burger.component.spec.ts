import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBurgerComponent } from './c-burger.component';

describe('CBurgerComponent', () => {
  let component: CBurgerComponent;
  let fixture: ComponentFixture<CBurgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CBurgerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CBurgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
