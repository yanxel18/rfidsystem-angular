import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAreatotalTableComponent } from './c-areatotal-table.component';

describe('CAreatotalTableComponent', () => {
  let component: CAreatotalTableComponent;
  let fixture: ComponentFixture<CAreatotalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAreatotalTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAreatotalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
