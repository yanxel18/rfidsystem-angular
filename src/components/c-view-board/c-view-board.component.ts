import {
  IAreaList,
  IEmployeeBoardArgs,
  IEmployeeCountRatio,
  ILocationList,
  IPageValues,
  IPerAreaGraph,
  IPositionList,
  ISkeletonLoader,
  ITeamList,
  perAreaArgs,
} from './../../models/viewboard-model';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { Subscription, take } from 'rxjs';
import { IViewEmployeeBoard } from 'src/models/viewboard-model';
import { CViewBoardService } from './c-view-board.service';
import { CViewBoardNaviComponent } from '../c-view-board-navi/c-view-board-navi.component';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { BoardGraphStyle } from 'src/models/enum';
import { AppService } from 'src/app/app.service'; 

@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
  providers: [CViewBoardService],
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
  positionList! : IPositionList[];
  openGraph: boolean = false;
  perAreaGraphData!: IPerAreaGraph[];
  selectedArea: number | null = null;
  selectedLocation: number | null = null;
  selectedTeam: number | null = null;
  selectedPosition: number | null = null;
  selectorFlag: boolean = false;
  selectedAreaText: string = 'すべて';
  searchValue: string | null = null;
  viewboardStatusRatio?: IEmployeeCountRatio;



  loaderStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '70px',
    'border-radius': '60px',
    width: '350px',
  };
  lineChart: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '25px',
    'border-radius': '4px',
  };
  @ViewChild('titleContainer', { static: true }) public titleContainer: any;
  @ViewChild(CViewBoardNaviComponent)
  ViewBoardNaviComponent!: CViewBoardNaviComponent;
  @ViewChild('searchbar') searchbar!: ElementRef; 
  toggleSearch: boolean = false;
  constructor(
    private viewboardService: CViewBoardService,
    private router: Router,
    private appServ: AppService
  ) {}

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const getpageview: string | null = this.appServ.tempGetKey('pagecountview');
    const getpagenum: string | null = this.appServ.tempGetKey('pagenum');
    const getArea: string | null = this.appServ.tempGetKey('areaSelected');
    const getAreaText: string | null =
      this.appServ.tempGetKey('selectedAreaText');
    const getTeam: string | null = this.appServ.tempGetKey('teamSelected');
    const getLoc: string | null = this.appServ.tempGetKey('locSelected');
    const getPos: string | null = this.appServ.tempGetKey('posSelected');
    const getViewBoard: string | null = this.appServ.tempGetKey('vgrph');
    this.pagecountview = getpageview
      ? parseInt(getpageview)
      : this.pagecountview;
    this.skeletonLoader = new Array<number>(this.pagecountview);
    this.pagenum = getpagenum ? parseInt(getpagenum) : this.pagenum;
    this.selectedArea = getArea ? parseInt(getArea) : null;
    this.selectedAreaText = getAreaText ? getAreaText : 'すべて';
    this.selectedTeam = getTeam ? parseInt(getTeam) : null;
    this.selectedLocation = getLoc ? parseInt(getLoc) : null;
    this.selectedPosition = getPos? parseInt(getPos) : null;
    this.openGraph = getViewBoard === '1' ? true : false;
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.initializeGraph();
  }
  reInitializeBoardFromList(
    allowed: boolean,
    event: MatSelectChange | null
  ): void {
    if (allowed) {
      const val = (event?.source.selected as MatOption)?.viewValue;
      this.selectedAreaText = val ? val : 'すべて';
    }
    this.Subscriptions.forEach((s) => s.unsubscribe());
    this.appServ.tempStoreKey(
      'areaSelected',
      this.selectedArea ? this.selectedArea.toString() : '-'
    );
    this.appServ.tempStoreKey(
      'selectedAreaText',
      this.selectedAreaText ? this.selectedAreaText.toString() : 'すべて'
    );
    this.appServ.tempStoreKey(
      'teamSelected',
      this.selectedTeam ? this.selectedTeam.toString() : '-'
    );
    this.appServ.tempStoreKey(
      'locSelected',
      this.selectedLocation ? this.selectedLocation.toString() : '-'
    );
    this.appServ.tempStoreKey(
      'posSelected',
      this.selectedPosition ? this.selectedPosition.toString() : '-'
    );
    this.pagenum = 1;
    this.appServ.tempStoreKey('pagenum', this.pagenum.toString());
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.ViewBoardNaviComponent.rerenderpaginator();
    this.initializeGraph();
  }

  openSearch(): void {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose(): void {
    this.searchValue = null;  
    this.toggleSearch = false; 
    this.reInitializeBoardFromList(false, null);
  }
  initializeGraph(): void {
    const perAreaDTO: perAreaArgs = {
      areaId: this.selectedArea,
      locationId: this.selectedLocation,
      teamId: this.selectedTeam,
      posID: this.selectedPosition
    };
    this.Subscriptions.push(
      this.viewboardService
        .getPerAreaGraph(perAreaDTO)
        .valueChanges.subscribe(({ data }) => {
          if (data) this.perAreaGraphData = data.PerAreaGraph;
        })
    );
  }
  initializeBoardView(): void {
    const paramDTO: IEmployeeBoardArgs = {
      search: this.searchValue,
      areaID: this.selectedArea,
      teamID: this.selectedTeam,
      locID: this.selectedLocation,
      posID: this.selectedPosition,
      pageoffset: this.pagecountview,
      pagenum: this.pagenum,
    };
    this.Subscriptions.push(
      this.viewboardService.getRealtimeBoardView(paramDTO).subscribe({
        next: ({ EmployeeBoardAll }) => {
          if (EmployeeBoardAll.EmployeeBoardAllSub) {
            if (EmployeeBoardAll.EmployeeBoardAllSub.length > 0) {
              this.empRealTime$ = EmployeeBoardAll.EmployeeBoardAllSub;
            } else this.empRealTime$ = [];
          }
          if (EmployeeBoardAll.AreaRatio) {
            this.viewboardStatusRatio = EmployeeBoardAll.AreaRatio;
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
    this.selectedPosition = null;
    this.selectedAreaText = 'すべて';
    this.reInitializeBoardFromList(false, null);
  }
  reInitializedBoardView(): void {
    const paramDTO: IEmployeeBoardArgs = {
      search: this.searchValue,
      areaID: this.selectedArea,
      teamID: this.selectedTeam,
      locID: this.selectedLocation,
      posID: this.selectedPosition,
      pageoffset: this.pagecountview,
      pagenum: this.pagenum,
    };
    this.Subscriptions.push(
      this.viewboardService.getRealtimeBoardView(paramDTO).subscribe((data) => {
        if (data) this.viewDropList();
      })
    );
  }

  getCurrentFilteredCount(): void {
    const paramDTO: IEmployeeBoardArgs = {
      search: this.searchValue,
      areaID: this.selectedArea,
      teamID: this.selectedTeam,
      locID: this.selectedLocation,
      posID: this.selectedPosition
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
              !this.selectedTeam &&
              !this.selectedPosition
            )
              this.selectorFlag = false;
            else this.selectorFlag = true;
          }
        })
    );
  }

  lineGraphStyle(): string {
    this.appServ.tempStoreKey('vgrph', this.openGraph ? '1' : '0');
    return this.openGraph ? BoardGraphStyle.IS_OPEN : BoardGraphStyle.IS_CLOSE;
  }
  viewDropList(): void {
    this.viewboardService.getViewDropList().refetch();
    this.Subscriptions.push(
      this.viewboardService
        .getViewDropList()
        .valueChanges.subscribe(({ data }) => {
          if (data) {
            const { IAreaList, ILocationList, ITeamList, IPositionList } = data.ViewDropList;
            this.areaList = IAreaList;
            this.locationList = ILocationList;
            this.teamList = ITeamList;
            this.positionList = IPositionList;
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
