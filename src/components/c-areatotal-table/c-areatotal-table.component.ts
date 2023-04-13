import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map } from 'rxjs';
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
  @ViewChild(MatSort) sort!: MatSort;
  tableDatasource!:  IPerArea[];
 
  displayedColumns: string[] = ['bldg', 'area', 'workerIn', 'workerInTotal', 'percent'];

 
  constructor() {}

    getTotalAreaSource(): Observable<any> {
    return this.DataSource.pipe(map((data) => {
      data?.PerArea
    }))
  }
  ngOnChanges(): void {
   this.DataSource.subscribe((data) =>{
     this.tableDatasource = data ? data.PerArea : []
   })
  
  }
}
