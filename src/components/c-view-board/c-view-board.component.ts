import { IEmployeeBoardArgs, IPageValues } from './../../models/viewboard-model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, map,Subscription } from 'rxjs'; 
import { Apollo } from 'apollo-angular';
import { IViewEmployeeBoard } from 'src/models/viewboard-model';
import { CViewBoardService } from './c-view-board.service';

@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
})
export class CViewBoardComponent implements OnInit, OnDestroy {
  empRealTime$!:  IViewEmployeeBoard[];
  comments: Observable<any> | undefined;
  empMaxCount!: Observable<number | null>;
  pagecountview: number = 10;
  pagenum: number = 1;
  skeletonLoader: Array<number> = [10];
  Subscriptions : Subscription [] = [];
  @ViewChild('titleContainer', { static: true }) public titleContainer: any;

  constructor(
    private viewboardService: CViewBoardService,
    private apollo: Apollo
  ) { } 
  
  ngOnInit(): void {
    this.viewboardService.getEmpCount().refetch();
    this.empMaxCount = this.viewboardService.getEmpCount().valueChanges.pipe(
      map(({ data }) => {
        return data.EmpCount;
      })
    );
      
     const getpageview: string | null  = localStorage?.getItem('pagecountview') 
     const getpagenum: string | null  = localStorage?.getItem('pagenum') 
     this.pagecountview = getpageview ? parseInt(getpageview) : this.pagecountview;
     this.skeletonLoader = new Array<number>(this.pagecountview);
     this.pagenum = getpagenum ? parseInt(getpagenum) : this.pagenum;
    this.initializeBoardView();
  }
  initializeBoardView(): void{
    const paramDTO: IEmployeeBoardArgs = {
      areaID: null,
      teamID: null,
      locID: null,
      pageoffset: this.pagecountview, //compute for the max page limit and page number display on dropdown
      pagenum: this.pagenum,
    }; 
      this.Subscriptions.push(this.viewboardService.getRealtimeBoardView(paramDTO).subscribe(data =>{ 
          this.empRealTime$ = data;
      }, err=> {
        console.log('here i have error!')
      })); 
      
  }
  trackCardIndex(index: number): number { 
    return index;
  }
  getPageNum(data: IPageValues): void { 
    this.empRealTime$ = [];
    this.pagecountview = data.pageSize;
    this.pagenum = data.pageIndex; 
    this.skeletonLoader = new Array<number>(this.pagecountview);
    this.Subscriptions.forEach((s) => s.unsubscribe());
    this.initializeBoardView();
  }
  ngOnDestroy(): void { 
    this.Subscriptions.forEach((s) => s.unsubscribe());
    }
}
