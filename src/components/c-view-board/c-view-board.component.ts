import {
  IAreaList,
  IEmployeeBoardArgs,
  IEmployeeCountRatio,
  ILocationList,
  IPageValues,
  IPerAreaGraph,
  ITeamList,
  perAreaArgs,
} from './../../models/viewboard-model';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, map, Subscription, take } from 'rxjs';
import { IViewEmployeeBoard } from 'src/models/viewboard-model';
import { CViewBoardService } from './c-view-board.service';
import { CViewBoardNaviComponent } from '../c-view-board-navi/c-view-board-navi.component'; 
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { BoardGraphStyle } from 'src/models/enum';

@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
  providers: [CViewBoardService],
  encapsulation: ViewEncapsulation.None,
})
export class CViewBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  DEFAULTCOUNT: number = 100;
  empRealTime$!: IViewEmployeeBoard[];
  checkDataSubscription!: Subscription;
  empMaxCount: number = 0;
  pagecountview: number = this.DEFAULTCOUNT;
  pagenum: number = 1;
  skeletonLoader: Array<number> = [this.DEFAULTCOUNT];
  Subscriptions: Subscription[] = [];
  areaList!: IAreaList[];
  locationList!: ILocationList[];
  teamList!: ITeamList[];
  openGraph: boolean = false;
  perAreaGraphData!: IPerAreaGraph[];
  selectedArea: number | null = null;
  selectedLocation: number | null = null;
  selectedTeam: number | null = null;
  selectorFlag: boolean = false;
  selectedAreaText: string = "すべて";
  viewboardStatusRatio?: IEmployeeCountRatio;
  @ViewChild('titleContainer', { static: true }) public titleContainer: any;
  @ViewChild(CViewBoardNaviComponent) ViewBoardNaviComponent!: CViewBoardNaviComponent;
  constructor(
    private viewboardService: CViewBoardService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const getpageview: string | null = localStorage?.getItem('pagecountview');
    const getpagenum: string | null = localStorage?.getItem('pagenum');
    const getArea: string | null = localStorage?.getItem('areaSelected');
    const getAreaText: string | null = localStorage?.getItem('selectedAreaText');
    const getTeam: string | null = localStorage?.getItem('teamSelected');
    const getLoc: string | null = localStorage?.getItem('locSelected');
    const getViewBoard: string | null = localStorage?.getItem('vgrph');
    this.pagecountview = getpageview
      ? parseInt(getpageview)
      : this.pagecountview;
    this.skeletonLoader = new Array<number>(this.pagecountview);
    this.pagenum = getpagenum ? parseInt(getpagenum) : this.pagenum;
    this.selectedArea = getArea ? parseInt(getArea) : null;
    this.selectedAreaText =getAreaText ? getAreaText : "すべて";
    this.selectedTeam = getTeam ? parseInt(getTeam) : null;
    this.selectedLocation = getLoc ? parseInt(getLoc) : null;
    this.openGraph = getViewBoard ==="1" ? true: false;
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.initializeGraph();
  }
  reInitializeBoardFromList(allowed:boolean, event: MatSelectChange | null): void {
    if (allowed) {
      const val = (event?.source.selected as MatOption)?.viewValue
      this.selectedAreaText = val ? val : "すべて";
    } 
    this.Subscriptions.forEach((s) => s.unsubscribe());
    localStorage.setItem(
      'areaSelected',
      this.selectedArea ? this.selectedArea.toString() : '-'
    );
    localStorage.setItem(
      'selectedAreaText',
      this.selectedAreaText ? this.selectedAreaText.toString() : 'すべて'
    );
    localStorage.setItem(
      'teamSelected',
      this.selectedTeam ? this.selectedTeam.toString() : '-'
    );
    localStorage.setItem(
      'locSelected',
      this.selectedLocation ? this.selectedLocation.toString() : '-'
    );
    this.pagenum = 1;
    localStorage.setItem('pagenum', (1).toString());
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.ViewBoardNaviComponent.rerenderpaginator();
    this.initializeGraph();
    

  }

  private initializeGraph(): void {
    const perAreaDTO: perAreaArgs = {
      areaId: this.selectedArea,
      locationId: this.selectedLocation,
      teamId: this.selectedTeam
    }
    this.Subscriptions.push(this.viewboardService.getPerAreaGraph(perAreaDTO).valueChanges.subscribe(({ data }) =>{
      if(data) this.perAreaGraphData = data.PerAreaGraph; 
    }));
 
  }
  private initializeBoardView(): void {

    const paramDTO: IEmployeeBoardArgs = {
      areaID: this.selectedArea,
      teamID: this.selectedTeam,
      locID: this.selectedLocation,
      pageoffset: this.pagecountview,
      pagenum: this.pagenum,
    };
    this.Subscriptions.push(
      this.viewboardService.getRealtimeBoardView(paramDTO).subscribe({
        next: ( { EmployeeBoardAll}) => {   
          if (EmployeeBoardAll.EmployeeBoardAllSub) { 
            if(EmployeeBoardAll.EmployeeBoardAllSub.length > 0) { 
              this.empRealTime$ = EmployeeBoardAll.EmployeeBoardAllSub; 
            } 
            else this.empRealTime$ = [];
          }
          if (EmployeeBoardAll.AreaRatio) {
            this.viewboardStatusRatio =  EmployeeBoardAll.AreaRatio;
          } 
        },

        error: () => {
          this.Subscriptions.forEach((s) => s.unsubscribe());
          this.initializeBoardView();
          this.reInitializedBoardView();
        },
      })
    );
    
  }
  selectOptionClear(): void {
    this.selectedLocation = null;
    this.selectedArea = null;
    this.selectedTeam = null;
    this.selectedAreaText =　"すべて";
    this.reInitializeBoardFromList(false,null);
  }
  private reInitializedBoardView(): void {
    const paramDTO: IEmployeeBoardArgs = {
      areaID: this.selectedArea,
      teamID: this.selectedTeam,
      locID: this.selectedLocation,
      pageoffset: this.pagecountview,
      pagenum: this.pagenum,
    };
    this.Subscriptions.push(
      this.viewboardService.getRealtimeBoardView(paramDTO).subscribe((data) => {
        if (data) this.viewDropList();
      }
       )
    );
  }
 
  getCurrentFilteredCount(): void {
    const paramDTO: IEmployeeBoardArgs = {
      areaID: this.selectedArea,
      teamID: this.selectedTeam,
      locID: this.selectedLocation,
    };
    this.viewboardService.getFilteredCount(paramDTO).refetch();
    this.Subscriptions.push(
      this.viewboardService
        .getFilteredCount(paramDTO)
        .valueChanges.pipe(take(1))
        .subscribe(({ data }) => {
          if (data) {
            this.empMaxCount = data.EmpBoardMaxCountFilter;
            if (
              !this.selectedArea &&
              !this.selectedLocation &&
              !this.selectedTeam
            )
              this.selectorFlag = false;
            else this.selectorFlag = true;
          }
        })
    );
  }


  boardStyleOnClick(): string {
    localStorage.setItem('vgrph',this.openGraph ? '1' : '0');
    return this.openGraph ? BoardGraphStyle.IS_OPEN : BoardGraphStyle.IS_CLOSE
  }
  viewDropList(): void {
    this.viewboardService.getViewDropList().refetch();
    this.Subscriptions.push(
      this.viewboardService
        .getViewDropList()
        .valueChanges.subscribe(({ data }) => {
          if (data) {
            const { IAreaList, ILocationList, ITeamList } = data.ViewDropList;
            this.areaList = IAreaList;
            this.locationList = ILocationList;
            this.teamList = ITeamList;
          }
        })
    );
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

  ngAfterViewInit(): void {
    this.viewDropList();
  }
  ngOnDestroy(): void {
    this.Subscriptions.forEach((s) => s.unsubscribe());
  }
}
