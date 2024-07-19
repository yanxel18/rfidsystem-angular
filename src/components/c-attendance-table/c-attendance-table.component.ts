import { Component, Input, OnChanges } from '@angular/core';
import { ITableList } from '../c-attendance-board/c-attendance-board.interface';

@Component({
  selector: 'app-c-attendance-table',
  templateUrl: './c-attendance-table.component.html',
  styleUrls: ['./c-attendance-table.component.sass'],
})
export class CAttendanceTableComponent implements OnChanges {
  @Input() InputTableList!: ITableList | null;

  tableDatasource: ITableList = [];
  readonly listColumns: string[] = [
    'divName',
    'kakariDesc',
    'koutaiInCount',
    'koutaiTotalCount',
    'koutaiPercent',
    'dayShiftInCount',
    'dayShiftTotalCount',
    'dayShiftPercent',
    'normalShiftInCount',
    'normalShiftTotalCount',
    'normalShiftPercent',
  ];

  ngOnChanges(): void {
    this.tableDatasource = this.InputTableList ?? [];
  }
}
