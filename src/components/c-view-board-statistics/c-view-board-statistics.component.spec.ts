import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CViewBoardStatisticsComponent } from './c-view-board-statistics.component';

describe('CViewBoardComponent', () => {
  let component: CViewBoardStatisticsComponent;
  let fixture: ComponentFixture<CViewBoardStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CViewBoardStatisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CViewBoardStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
