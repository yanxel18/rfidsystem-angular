import { Component, Input, OnChanges } from '@angular/core';
import { ProgressLoadColor } from 'src/models/enum';
import { ITableTotal } from '../c-attendance-board/c-attendance-board.interface';

@Component({
  selector: 'app-c-attendance-stats',
  templateUrl: './c-attendance-stats.component.html',
  styleUrls: ['./c-attendance-stats.component.sass'],
})
export class CAttendanceStatsComponent implements OnChanges {
  @Input() InputTableTotal!: ITableTotal | null;

  progressValue = 0;
  tableTotalValue: ITableTotal[] = [];

  ngOnChanges(): void {
    this.progressValue = this.InputTableTotal?.[0].workerInPercent ?? 0;
  }

  percentLoadColor(): string {
    if (this.progressValue === 100) return ProgressLoadColor.COLOR_GREEN;
    else if (this.progressValue >= 50 && this.progressValue <= 99)
      return ProgressLoadColor.COLOR_BLUE;
    else if (this.progressValue > 25 && this.progressValue < 50)
      return ProgressLoadColor.COLOR_ORANGE;
    else return ProgressLoadColor.COLOR_RED;
  }
}
