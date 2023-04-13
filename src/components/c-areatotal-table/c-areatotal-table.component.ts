import { Component, Input, OnChanges } from '@angular/core';
import { Observable} from 'rxjs';
import { IPerArea, IPerAreaTotalStatistics } from 'src/models/viewboard-model';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
 
@Component({
  selector: 'app-c-areatotal-table',
  templateUrl: './c-areatotal-table.component.html',
  styleUrls: ['./c-areatotal-table.component.sass'],
})
export class CAreatotalTableComponent implements OnChanges {
  @Input() DataSource!: Observable<IPerAreaTotalStatistics | null>;
  tableDatasource!:  IPerArea[];
  displayedColumns: string[] = ['bldg', 'area', 'workerIn', 'workerInTotal', 'percent'];

  constructor() {}

  ngOnChanges(): void {
    this.DataSource.subscribe((data) =>{
      this.tableDatasource = data ? data.PerArea : []
    })
  }
}
