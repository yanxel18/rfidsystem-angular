import {
  IAreaList,
  IDefaultStoreValue,
  IDivisionList,
  IEmployeeBoardArgs,
  IEmployeeCountRatio,
  IKakariList,
  ILocationList,
  IPageValues,
  IPerAreaGraph,
  IPositionList,
  ISkeletonLoader,
  ITeamList,
} from './../../models/viewboard-model';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { Observable, Subscription, map, take } from 'rxjs';
import { IViewEmployeeBoard } from 'src/models/viewboard-model';
import { CViewBoardService } from './c-view-board.service';
import { CViewBoardNaviComponent } from '../c-view-board-navi/c-view-board-navi.component';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { BoardGraphStyle } from 'src/models/enum';
import { AppService } from 'src/app/app.service';
import { Title } from '@angular/platform-browser';
import { toHalfwidthKana } from 'japanese-string-utils';
import { MatRadioChange } from '@angular/material/radio';
@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
  providers: [CViewBoardService, AppService],
})
export class CViewBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly componentTitle: string = 'リアルタイム監視';
  readonly DEFAULTCOUNT: number = 100;
  empRealTime!: IViewEmployeeBoard[];
  empMaxCount$!: Observable<number>;
  pagecountview: number = this.DEFAULTCOUNT;
  pagenum = 1;
  skeletonLoader: Array<number> = [this.DEFAULTCOUNT];
  Subscriptions: Subscription[] = [];
  areaList$!: Observable<IAreaList[]>;
  locationList$!: Observable<ILocationList[]>;
  teamList$!: Observable<ITeamList[]>;
  positionList$!: Observable<IPositionList[]>;
  divisionList$!: Observable<IDivisionList[]>;
  kakariList$!: Observable<IKakariList[]>;
  openGraph = false;
  perAreaGraphData$!: Observable<IPerAreaGraph[]>;
  selectedAreaText = 'すべて';
  filterValues: IEmployeeBoardArgs = {
    search: null,
    areaID: null,
    teamID: null,
    locID: null,
    posID: null,
    divID: null,
    kakariID: null, 
    pageoffset: null,
    pagenum: 1,
    order: null,
  }; 
  searchValue: string | null = null;
  searchStart = false;
  viewboardStatusRatio?: IEmployeeCountRatio;
  toggleSearch = false;

  readonly loaderStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '70px',
    'border-radius': '60px',
    width: '350px',
  };
  readonly lineChart: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '25px',
    'border-radius': '4px',
  };
  readonly lineChart2: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '25px',
    'border-radius': '4px',
  };
  @ViewChild(CViewBoardNaviComponent)
  ViewBoardNaviComponent!: CViewBoardNaviComponent;
  @ViewChild('searchbar') searchbar!: ElementRef;

  constructor(
    private viewboardService: CViewBoardService,
    private appServ: AppService,
    private title: Title
  ) {}

  localValue: IDefaultStoreValue = this.getlocalValue();

  ngOnInit(): void {
    this.pagecountview =
      typeof this.localValue.getPageView === 'string'
        ? +this.localValue.getPageView
        : this.pagecountview;
    this.skeletonLoader = new Array<number>(this.pagecountview);
    this.pagenum =
      typeof this.localValue.getpagenum === 'string'
        ? +this.localValue.getpagenum
        : this.pagenum;

    this.selectedAreaText =
      typeof this.localValue.getAreaText === 'string'
        ? this.localValue.getAreaText
        : 'すべて';
    this.filterValues = {
      areaID:
        typeof this.localValue.getArea === 'string'
          ? +this.localValue.getArea
          : null,
      teamID:
        typeof this.localValue.getTeam === 'string'
          ? +this.localValue.getTeam
          : null,
      locID:
        typeof this.localValue.getLoc === 'string'
          ? +this.localValue.getLoc
          : null,
      posID:
        typeof this.localValue.getPos === 'string'
          ? +this.localValue.getPos
          : null,
      order:
        typeof this.localValue.getSort === 'string'
          ? +this.localValue.getSort
          : null,
      divID:
        typeof this.localValue.getDivision === 'string'
          ? +this.localValue.getDivision
          : null,
      kakariID:
        typeof this.localValue.getKakari === 'string'
          ? +this.localValue.getKakari
          : null,
      pageoffset: null,
      search: null,
      pagenum: null,
    };
    this.openGraph = this.localValue.getViewBoard === '1' ? true : false;
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.initializeGraph();
  }

  private getlocalValue(): IDefaultStoreValue {
    return {
      getPageView: this.appServ.tempGetKey('pagecountview'),
      getpagenum: this.appServ.tempGetKey('pagenum'),
      getArea: this.appServ.tempGetKey('areaSelected'),
      getAreaText: this.appServ.tempGetKey('selectedAreaText'),
      getTeam: this.appServ.tempGetKey('teamSelected'),
      getLoc: this.appServ.tempGetKey('locSelected'),
      getPos: this.appServ.tempGetKey('posSelected'),
      getViewBoard: this.appServ.tempGetKey('vgrph'),
      getDivision: this.appServ.tempGetKey('divSelected'),
      getSort: this.appServ.tempGetKey('order'),
      getKakari: this.appServ.tempGetKey('kakariSelected'),
    };
  }

  reInitializeBoardFromList(
    allowed: boolean,
    event: MatSelectChange | null
  ): void {
    if (allowed) {
      const val = (event?.source.selected as MatOption)?.viewValue;
      this.selectedAreaText = val ?? 'すべて';
    }
    this.Subscriptions.forEach((s) => s.unsubscribe());
    this.appServ.tempStoreKey(
      'areaSelected',
      this.filterValues.areaID ? String(this.filterValues.areaID) : '-'
    );
    this.appServ.tempStoreKey(
      'selectedAreaText',
      this.selectedAreaText ? String(this.selectedAreaText) : 'すべて'
    );
    this.appServ.tempStoreKey(
      'teamSelected',
      this.filterValues.teamID ? String(this.filterValues.teamID) : '-'
    );
    this.appServ.tempStoreKey(
      'locSelected',
      this.filterValues.locID ? String(this.filterValues.locID) : '-'
    );
    this.appServ.tempStoreKey(
      'posSelected',
      this.filterValues.posID ? String(this.filterValues.posID) : '-'
    );
    this.appServ.tempStoreKey(
      'divSelected',
      this.filterValues.divID ? String(this.filterValues.divID) : '-'
    );
    this.appServ.tempStoreKey(
      'order',
      this.filterValues.order ? String(this.filterValues.order) : '0'
    );
    this.appServ.tempStoreKey(
      'kakariSelected',
      this.filterValues.kakariID ? String(this.filterValues.kakariID) : '-'
    );
    this.pagenum = 1;
    this.appServ.tempStoreKey('pagenum', String(this.pagenum));
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.ViewBoardNaviComponent.rerenderpaginator();
    this.initializeGraph();
  }

  private setTitle(): void {
    this.title.setTitle(`${this.selectedAreaText}/${this.appServ.appTitle}`);
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
  private initializeGraph(): void {
    this.perAreaGraphData$ = this.viewboardService
      .getPerAreaGraph(this.viewBoardParam())
      .pipe(
        map(({ data }) => {
          return data.PerAreaGraph ?? [];
        })
      );
    this.setTitle();
  }

  private initializeBoardView(): void {
    this.Subscriptions.push(
      this.viewboardService
        .getRealtimeBoardView(this.viewBoardParam())
        .subscribe({
          next: ({ EmployeeBoardAll }) => {
            if (EmployeeBoardAll.EmployeeBoardAllSub) {
              if (EmployeeBoardAll.EmployeeBoardAllSub.length > 0) {
                this.empRealTime = EmployeeBoardAll.EmployeeBoardAllSub;
              } else this.empRealTime = [];
            }
            if (EmployeeBoardAll.AreaRatio)
              this.viewboardStatusRatio = EmployeeBoardAll.AreaRatio;
          },
          error: () => {
            this.Subscriptions.forEach((s) => s.unsubscribe());
            this.initializeBoardView();
            this.reInitializedBoardView();
          },
        })
    );
  }
  sortCard(sortVal: MatRadioChange): void {
    this.filterValues.order = +sortVal.value;
    this.reInitializeBoardFromList(false, null);
  }
  selectOptionClear(): void {
    this.filterValues.locID = null;
    this.filterValues.areaID = null;
    this.filterValues.teamID = null;
    this.filterValues.posID = null;
    this.filterValues.divID = null;
    this.filterValues.kakariID = null;
    this.selectedAreaText = 'すべて';
    this.reInitializeBoardFromList(false, null);
  }
  private reInitializedBoardView(): void {
    this.Subscriptions.push(
      this.viewboardService
        .getRealtimeBoardView(this.viewBoardParam())
        .subscribe((data) => {
          if (data) this.viewDropList();
        })
    );
  }

  private getCurrentFilteredCount(): void {
    this.empMaxCount$ = this.viewboardService
      .getFilteredCount(this.viewBoardParam())
      .pipe(take(1))
      .pipe(
        map(({ data }) => {
          return data.EmpBoardMaxCountFilter ?? 0;
        })
      );
  }

  lineGraphState(): void {
    this.appServ.tempStoreKey('vgrph', this.openGraph ? '1' : '0');
  }

  lineGraphStyle(): string {
    return this.openGraph ? BoardGraphStyle.IS_OPEN : BoardGraphStyle.IS_CLOSE;
  }

  private viewDropList(): void {
    const dropDownlist = this.viewboardService.getViewDropList().pipe(
      map(({ data }) => {
        return data.ViewDropList;
      })
    );
    this.areaList$ = dropDownlist.pipe(
      map((data) => {
        return data.IAreaList ?? [];
      })
    );
    this.locationList$ = dropDownlist.pipe(
      map((data) => {
        return data.ILocationList ?? [];
      })
    );
    this.teamList$ = dropDownlist.pipe(
      map((data) => {
        return data.ITeamList ?? [];
      })
    );
    this.positionList$ = dropDownlist.pipe(
      map((data) => {
        return data.IPositionList ?? [];
      })
    );

    this.divisionList$ = dropDownlist.pipe(
      map((data) => {
        return data.IDivisionList ?? [];
      })
    );
    this.kakariList$ = dropDownlist.pipe(
      map((data) => {
        return data.IKakariList ?? [];
      })
    );
  }

  private viewBoardParam(): IEmployeeBoardArgs {
    return {
      search:
        typeof this.searchValue === 'string'
          ? toHalfwidthKana(this.searchValue)
          : null,
      areaID: this.filterValues.areaID,
      teamID: this.filterValues.teamID,
      locID: this.filterValues.locID,
      order: this.filterValues.order,
      posID: this.filterValues.posID,
      kakariID: this.filterValues.kakariID,
      divID: this.filterValues.divID,
      pageoffset: this.pagecountview,
      pagenum: this.pagenum,
    };
  }

  trackCardIndex(index: number): number {
    return index;
  }

  getPageNum(data: IPageValues): void {
    this.empRealTime = [];
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
