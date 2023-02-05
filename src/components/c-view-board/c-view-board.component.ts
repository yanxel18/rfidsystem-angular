import {
  IAreaList,
  IEmployeeBoardArgs,
  ILocationList,
  IPageValues,
  ITeamList,
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

@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
  providers:[CViewBoardService],
  encapsulation: ViewEncapsulation.None,
})
export class CViewBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  empRealTime$!: IViewEmployeeBoard[];
  comments: Observable<any> | undefined;
  empMaxCount: number = 0;
  pagecountview: number = 15;
  pagenum: number = 1;
  skeletonLoader: Array<number> = [15];
  Subscriptions: Subscription[] = [];
  areaList!: IAreaList[];
  locationList!: ILocationList[];
  teamList!: ITeamList[];
  selectedArea: number | null = null;
  selectedLocation: number | null = null;
  selectedTeam: number | null = null;
  selectorFlag: boolean = false;

  @ViewChild('titleContainer', { static: true }) public titleContainer: any;
  @ViewChild(CViewBoardNaviComponent)
  ViewBoardNaviComponent!: CViewBoardNaviComponent;
  constructor(private viewboardService: CViewBoardService) {}

  ngOnInit(): void {
    const getpageview: string | null = localStorage?.getItem('pagecountview');
    const getpagenum: string | null = localStorage?.getItem('pagenum');
    const getArea: string | null = localStorage?.getItem('areaSelected');
    const getTeam: string | null = localStorage?.getItem('teamSelected');
    const getLoc: string | null = localStorage?.getItem('locSelected');
    this.pagecountview = getpageview
      ? parseInt(getpageview)
      : this.pagecountview;
    this.skeletonLoader = new Array<number>(this.pagecountview);
    this.pagenum = getpagenum ? parseInt(getpagenum) : this.pagenum;
    this.selectedArea = getArea ? parseInt(getArea) : null;
    this.selectedTeam = getTeam ? parseInt(getTeam) : null;
    this.selectedLocation = getLoc ? parseInt(getLoc) : null;
    this.getCurrentFilteredCount();
    this.initializeBoardView();
  }
  reInitializeBoardFromList(): void {
    this.Subscriptions.forEach((s) => s.unsubscribe());
    localStorage.setItem(
      'areaSelected',
      this.selectedArea ? this.selectedArea.toString() : '-'
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
        next: (data) => {
          this.empRealTime$ = data;
        },
        error: () => {
          this.Subscriptions.forEach((s) => s.unsubscribe());
          this.initializeBoardView();
          this.reInitializedBoardView();
        },
      })
    );
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
      this.viewboardService.getRealtimeBoardView(paramDTO).subscribe({
        next: (data) => {
          if (data) {
            this.viewDropList();
            //this.getMaxEmpNum();
          }
        },
      })
    );
  }
  // getMaxEmpNum(): void {
  //   this.viewboardService.getEmpCount().refetch();
  //   this.Subscriptions.push(
  //     this.viewboardService
  //       .getEmpCount()
  //       .valueChanges.pipe(take(1))
  //       .subscribe(({ data }) => {
  //         this.empMaxCount = data.EmpCount ? data.EmpCount : 0;
  //       })
  //   );
  // }
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
