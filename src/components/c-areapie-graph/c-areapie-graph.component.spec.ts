import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAreapieGraphComponent } from './c-areapie-graph.component';
describe('CAreapieGraphComponent', () => {
  let component: CAreapieGraphComponent;
  let fixture: ComponentFixture<CAreapieGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CAreapieGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CAreapieGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
