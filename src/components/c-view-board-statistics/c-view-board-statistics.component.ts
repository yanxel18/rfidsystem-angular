import { Component, Input } from '@angular/core';
import { ProgressLoadColor } from 'src/models/enum';
import { IEmployeeCountRatio } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-view-board-statistics',
  templateUrl: './c-view-board-statistics.component.html',
  styleUrls: ['./c-view-board-statistics.component.sass'],
})
export class CViewBoardStatisticsComponent {
  @Input() InputEmployeeCountRatio?: IEmployeeCountRatio;
  @Input() InputSelectedTextArea?: string;
  @Input() InputIsSearching?: boolean;

  workInPercent(): number {
    return typeof this.InputEmployeeCountRatio?.currentPercent === 'string'
      ? +this.InputEmployeeCountRatio.currentPercent.replace('%', '')
      : 0;
  }

  percentLoadColor(actualValue: number): string {
    if (actualValue === 100) return ProgressLoadColor.COLOR_GREEN;
    else if (actualValue >= 50 && actualValue <= 99)
      return ProgressLoadColor.COLOR_BLUE;
    else if (actualValue > 25 && actualValue < 50)
      return ProgressLoadColor.COLOR_ORANGE;
    else return ProgressLoadColor.COLOR_RED;
  }
}
