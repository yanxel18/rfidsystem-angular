import { Component, Input, OnChanges } from '@angular/core';
import { ProgressLoadColor } from 'src/models/enum';
import { IEmployeeCountRatio } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-view-board-statistics',
  templateUrl: './c-view-board-statistics.component.html',
  styleUrls: ['./c-view-board-statistics.component.sass'],
})
export class CViewBoardStatisticsComponent implements OnChanges {
  @Input() InputEmployeeCountRatio?: IEmployeeCountRatio;
  @Input() InputSelectedTextArea?: string;
  @Input() InputIsSearching?: boolean;

  workerPercentage = 0;
  loadColor = '';
  workInPercent(): number {
    return typeof this.InputEmployeeCountRatio?.currentPercent === 'string'
      ? +this.InputEmployeeCountRatio.currentPercent.replace('%', '')
      : 0;
  }

  percentLoadColor(): string {
    if (this.workerPercentage === 100) return ProgressLoadColor.COLOR_GREEN;
    else if (this.workerPercentage >= 50 && this.workerPercentage <= 99)
      return ProgressLoadColor.COLOR_BLUE;
    else if (this.workerPercentage > 25 && this.workerPercentage < 50)
      return ProgressLoadColor.COLOR_ORANGE;
    else return ProgressLoadColor.COLOR_RED;
  }
  ngOnChanges(): void {
    if (this.InputEmployeeCountRatio) {
      this.workerPercentage = this.workInPercent();
      this.loadColor = this.percentLoadColor();
    }
  }
}
