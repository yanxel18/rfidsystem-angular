import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CViewBoardNaviComponent } from './c-view-board-navi.component';

describe('CViewBoardNaviComponent', () => {
  let component: CViewBoardNaviComponent;
  let fixture: ComponentFixture<CViewBoardNaviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CViewBoardNaviComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CViewBoardNaviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
