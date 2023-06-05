import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  IPerArea,
  IPerAreaTotalStatistics,
  ITotalArea,
} from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-areatotal-table',
  templateUrl: './c-areatotal-table.component.html',
  styleUrls: ['./c-areatotal-table.component.sass'],
})
export class CAreatotalTableComponent implements OnChanges {
  @Input() DataSource!: IPerAreaTotalStatistics | null;
  @Output() PieDataSource = new EventEmitter<ITotalArea[] | null>();
  tableDatasource!: IPerArea[];
  displayedColumns: string[] = [
    'bldg',
    'area',
    'workerIn',
    'workerInTotal',
    'percent',
  ];

  ngOnChanges(): void {
    this.tableDatasource = this.DataSource ? this.DataSource.PerArea : [];
  }

  getTableRow(element: IPerArea): void {
    const rawData: ITotalArea[] = [];
    const newTotalArea: ITotalArea = {
      total: element.workerInTotal,
      percent: element.percent,
      workerIn: element.workerIn,
    };
    rawData.push(newTotalArea);
    this.PieDataSource.emit(rawData);
  }
}
