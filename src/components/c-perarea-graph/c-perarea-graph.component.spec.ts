import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPerareaGraphComponent } from './c-perarea-graph.component';

describe('CPerareaGraphComponent', () => {
  let component: CPerareaGraphComponent;
  let fixture: ComponentFixture<CPerareaGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPerareaGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPerareaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
