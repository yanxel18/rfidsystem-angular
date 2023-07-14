import {
  IAreaList,
  IDefaultStoreValue,
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
  readonly componentTitle: string = "リアルタイム監視";
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
  readonly loaderStyle: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "70px",
    "border-radius": "60px",
    width: "350px",
  };
  readonly lineChart: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "25px",
    "border-radius": "4px",
  };
  readonly lineChart2: ISkeletonLoader = {
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

  localValue: IDefaultStoreValue = this.getlocalValue();

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.pagecountview =
      typeof this.localValue.getPageView === "string"
        ? +this.localValue.getPageView
        : this.pagecountview;
    this.skeletonLoader = new Array<number>(this.pagecountview);
    this.pagenum =
      typeof this.localValue.getpagenum === "string"
        ? +this.localValue.getpagenum
        : this.pagenum;
    this.selectedArea =
      typeof this.localValue.getArea === "string"
        ? +this.localValue.getArea
        : null;
    this.selectedAreaText =
      typeof this.localValue.getAreaText === "string"
        ? this.localValue.getAreaText
        : "すべて";
    this.selectedTeam =
      typeof this.localValue.getTeam === "string"
        ? +this.localValue.getTeam
        : null;
    this.selectedLocation =
      typeof this.localValue.getLoc === "string"
        ? +this.localValue.getLoc
        : null;
    this.selectedPosition =
      typeof this.localValue.getPos === "string"
        ? +this.localValue.getPos
        : null;
    this.selectedOrder =
      typeof this.localValue.getSort === "string"
        ? +this.localValue.getSort
        : null;
    this.selectedDivision =
      typeof this.localValue.getDivision === "string"
        ? +this.localValue.getDivision
        : null;
    this.openGraph = this.localValue.getViewBoard === "1" ? true : false;
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.initializeGraph();
  }

  private getlocalValue(): IDefaultStoreValue {
    return {
      getPageView: this.appServ.tempGetKey("pagecountview"),
      getpagenum: this.appServ.tempGetKey("pagenum"),
      getArea: this.appServ.tempGetKey("areaSelected"),
      getAreaText: this.appServ.tempGetKey("selectedAreaText"),
      getTeam: this.appServ.tempGetKey("teamSelected"),
      getLoc: this.appServ.tempGetKey("locSelected"),
      getPos: this.appServ.tempGetKey("posSelected"),
      getViewBoard: this.appServ.tempGetKey("vgrph"),
      getDivision: this.appServ.tempGetKey("divSelected"),
      getSort: this.appServ.tempGetKey("order"),
    };
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
      this.selectedArea ? String(this.selectedArea) : "-"
    );
    this.appServ.tempStoreKey(
      "selectedAreaText",
      this.selectedAreaText ? String(this.selectedAreaText) : "すべて"
    );
    this.appServ.tempStoreKey(
      "teamSelected",
      this.selectedTeam ? String(this.selectedTeam) : "-"
    );
    this.appServ.tempStoreKey(
      "locSelected",
      this.selectedLocation ? String(this.selectedLocation) : "-"
    );
    this.appServ.tempStoreKey(
      "posSelected",
      this.selectedPosition ? String(this.selectedPosition) : "-"
    );
    this.appServ.tempStoreKey(
      "divSelected",
      this.selectedDivision ? String(this.selectedDivision) : "-"
    );
    this.appServ.tempStoreKey(
      "order",
      this.selectedOrder ? String(this.selectedOrder) : "0"
    );
    this.pagenum = 1;
    this.appServ.tempStoreKey("pagenum", String(this.pagenum));
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
    this.appServ.tempStoreKey("vgrph", this.openGraph ? "1" : "0");
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
  }

  private viewBoardParam(): IEmployeeBoardArgs {
    return {
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
