import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CViewBoardComponent } from './c-view-board.component';

describe('CViewBoardComponent', () => {
  let component: CViewBoardComponent;
  let fixture: ComponentFixture<CViewBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CViewBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CViewBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
