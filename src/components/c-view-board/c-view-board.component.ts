import {
  IAreaList,
  IDivisionList,
  IEmployeeBoardArgs,
  IEmployeeCountRatio,
  ILocationList,
  IPageValues,
  IPerAreaGraph,
  IPositionList,
  ISkeletonLoader,
  ITeamList,
} from "./../../models/viewboard-model";
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { Observable, Subscription, map, take } from "rxjs";
import { IViewEmployeeBoard } from "src/models/viewboard-model";
import { CViewBoardService } from "./c-view-board.service";
import { CViewBoardNaviComponent } from "../c-view-board-navi/c-view-board-navi.component";
import { MatSelectChange } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { Router } from "@angular/router";
import { BoardGraphStyle } from "src/models/enum";
import { AppService } from "src/app/app.service";
import { Title } from "@angular/platform-browser";
@Component({
  selector: "app-c-view-board",
  templateUrl: "./c-view-board.component.html",
  styleUrls: ["./c-view-board.component.sass"],
  providers: [CViewBoardService, AppService],
})
export class CViewBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  componentTitle = "リアルタイム監視";
  DEFAULTCOUNT = 100;
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
  openGraph = false;
  perAreaGraphData$!: Observable<IPerAreaGraph[]>;
  selectedArea: number | null = null;
  selectedLocation: number | null = null;
  selectedTeam: number | null = null;
  selectedPosition: number | null = null;
  selectedAreaText = "すべて";
  selectedOrder: number | null = null;
  selectedDivision: number | null = null;
  searchValue: string | null = null;
  searchStart = false;
  viewboardStatusRatio?: IEmployeeCountRatio;
  toggleSearch = false;
  loaderStyle: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "70px",
    "border-radius": "60px",
    width: "350px",
  };
  lineChart: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "25px",
    "border-radius": "4px",
  };
  lineChart2: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "25px",
    "border-radius": "4px",
  };
  @ViewChild(CViewBoardNaviComponent)
  ViewBoardNaviComponent!: CViewBoardNaviComponent;
  @ViewChild("searchbar") searchbar!: ElementRef;

  constructor(
    private viewboardService: CViewBoardService,
    private router: Router,
    private appServ: AppService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const getpageview: string | null = this.appServ.tempGetKey("pagecountview");
    const getpagenum: string | null = this.appServ.tempGetKey("pagenum");
    const getArea: string | null = this.appServ.tempGetKey("areaSelected");
    const getAreaText: string | null =
      this.appServ.tempGetKey("selectedAreaText");
    const getTeam: string | null = this.appServ.tempGetKey("teamSelected");
    const getLoc: string | null = this.appServ.tempGetKey("locSelected");
    const getPos: string | null = this.appServ.tempGetKey("posSelected");
    const getViewBoard: string | null = this.appServ.tempGetKey("vgrph");
    const getDivision: string | null = this.appServ.tempGetKey("divSelected");
    const getSort: string | null = this.appServ.tempGetKey("order");
    this.pagecountview = getpageview ? +getpageview : this.pagecountview;
    this.skeletonLoader = new Array<number>(this.pagecountview);
    this.pagenum = getpagenum ? +getpagenum : this.pagenum;
    this.selectedArea = getArea ? +getArea : null;
    this.selectedAreaText = getAreaText ? getAreaText : "すべて";
    this.selectedTeam = getTeam ? +getTeam : null;
    this.selectedLocation = getLoc ? +getLoc : null;
    this.selectedPosition = getPos ? +getPos : null;
    this.selectedOrder = getSort ? +getSort : null;
    this.selectedDivision = getDivision ? +getDivision : null;
    this.openGraph = getViewBoard === "1" ? true : false;
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
      this.selectedAreaText = val ? val : "すべて";
    }
    this.Subscriptions.forEach((s) => s.unsubscribe());
    this.appServ.tempStoreKey(
      "areaSelected",
      this.selectedArea ? this.selectedArea.toString() : "-"
    );
    this.appServ.tempStoreKey(
      "selectedAreaText",
      this.selectedAreaText ? this.selectedAreaText.toString() : "すべて"
    );
    this.appServ.tempStoreKey(
      "teamSelected",
      this.selectedTeam ? this.selectedTeam.toString() : "-"
    );
    this.appServ.tempStoreKey(
      "locSelected",
      this.selectedLocation ? this.selectedLocation.toString() : "-"
    );
    this.appServ.tempStoreKey(
      "posSelected",
      this.selectedPosition ? this.selectedPosition.toString() : "-"
    );
    this.appServ.tempStoreKey(
      "divSelected",
      this.selectedDivision ? this.selectedDivision.toString() : "-"
    );
    this.appServ.tempStoreKey(
      "order",
      this.selectedOrder ? this.selectedOrder.toString() : "0"
    );
    this.pagenum = 1;
    this.appServ.tempStoreKey("pagenum", this.pagenum.toString());
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.ViewBoardNaviComponent.rerenderpaginator();
    this.initializeGraph();
  }
  setTitle(): void {
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
  initializeGraph(): void {
    this.perAreaGraphData$ = this.viewboardService
      .getPerAreaGraph(this.ViewBoardParam)
      .valueChanges.pipe(
        map(({ data }) => {
          return data.PerAreaGraph ? data.PerAreaGraph : [];
        })
      );
    this.setTitle();
  }
  initializeBoardView(): void {
    this.Subscriptions.push(
      this.viewboardService
        .getRealtimeBoardView(this.ViewBoardParam)
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
  sortCard(sortVal: number): void {
    this.selectedOrder = sortVal;
    this.reInitializeBoardFromList(false, null);
  }
  selectOptionClear(): void {
    this.selectedLocation = null;
    this.selectedArea = null;
    this.selectedTeam = null;
    this.selectedPosition = null;
    this.selectedDivision = null;
    this.selectedAreaText = "すべて";
    this.reInitializeBoardFromList(false, null);
  }
  reInitializedBoardView(): void {
    this.Subscriptions.push(
      this.viewboardService
        .getRealtimeBoardView(this.ViewBoardParam)
        .subscribe((data) => {
          if (data) this.viewDropList();
        })
    );
  }

  getCurrentFilteredCount(): void {
    this.viewboardService.getFilteredCount(this.ViewBoardParam).refetch();
    this.empMaxCount$ = this.viewboardService
      .getFilteredCount(this.ViewBoardParam)
      .valueChanges.pipe(take(1))
      .pipe(
        map(({ data }) => {
          return data.EmpBoardMaxCountFilter ? data.EmpBoardMaxCountFilter : 0;
        })
      );
  }

  lineGraphStyle(): string {
    this.appServ.tempStoreKey("vgrph", this.openGraph ? "1" : "0");
    return this.openGraph ? BoardGraphStyle.IS_OPEN : BoardGraphStyle.IS_CLOSE;
  }
  viewDropList(): void {
    this.viewboardService.getViewDropList().refetch();
    const dropDownlist = this.viewboardService
      .getViewDropList()
      .valueChanges.pipe(
        map(({ data }) => {
          return data.ViewDropList;
        })
      );
    this.areaList$ = dropDownlist.pipe(
      map((data) => {
        return data ? data.IAreaList : [];
      })
    );
    this.locationList$ = dropDownlist.pipe(
      map((data) => {
        return data ? data.ILocationList : [];
      })
    );
    this.teamList$ = dropDownlist.pipe(
      map((data) => {
        return data ? data.ITeamList : [];
      })
    );
    this.positionList$ = dropDownlist.pipe(
      map((data) => {
        return data ? data.IPositionList : [];
      })
    );

    this.divisionList$ = dropDownlist.pipe(
      map((data) => {
        return data ? data.IDivisionList : [];
      })
    );
  }

  get ViewBoardParam(): IEmployeeBoardArgs {
    const formInfo: IEmployeeBoardArgs = {
      search: this.searchValue,
      areaID: this.selectedArea,
      teamID: this.selectedTeam,
      locID: this.selectedLocation,
      order: this.selectedOrder,
      posID: this.selectedPosition,
      divID: this.selectedDivision,
      pageoffset: this.pagecountview,
      pagenum: this.pagenum,
    };
    return formInfo;
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
