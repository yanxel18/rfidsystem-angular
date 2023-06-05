import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CScrolltopComponent } from './c-scrolltop.component';

describe('CScrolltopComponent', () => {
  let component: CScrolltopComponent;
  let fixture: ComponentFixture<CScrolltopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CScrolltopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CScrolltopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
