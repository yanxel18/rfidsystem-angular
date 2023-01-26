import { IEmployeeBoardArgs } from './../../models/viewboard-model';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Apollo } from 'apollo-angular';
import { IViewEmployeeBoard } from 'src/models/viewboard-model';
import { CViewBoardService } from './c-view-board.service';

@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
})
export class CViewBoardComponent implements OnInit {
  empRealTime$!: Observable<IViewEmployeeBoard[]>;
  comments: Observable<any> | undefined;
  constructor(
    private viewboardService: CViewBoardService,
    private apollo: Apollo
  ) {
    const paramDTO: IEmployeeBoardArgs = {
      areaID: null,
      teamID: null,
      locID: null,
      pageoffset: null, //compute for the max page limit and page number display on dropdown
      pagenum:1
  }
    this.empRealTime$ = this.viewboardService.getRealtimeBoardView(paramDTO) 
  }
  viewBoard$!: Observable<IViewEmployeeBoard[]>;

  ngOnInit(): void {

    
 
  }
}
