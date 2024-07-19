import {
  IAreaList,
  IDefaultStoreValue,
  IDivisionList,
  IEmployeeBoardArgs,
  IEmployeeCountRatio,
  IKakariList,
  ILocationList,
  IPageValues,
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
import { MatSelect } from '@angular/material/select';
import { AppService } from 'src/app/app.service';
import { Title } from '@angular/platform-browser';
import { toHalfwidthKana } from 'japanese-string-utils';
import { MatRadioChange } from '@angular/material/radio';
import { FormControl, FormGroup } from '@angular/forms';
import {
  FilterTypes,
  IFilterTypes,
  ISelectedItem,
} from '../c-view-board/c-view-interface';

@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
  providers: [CViewBoardService, AppService],
})
export class CViewBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly componentTitle: string = 'リアルタイム監視';
  readonly DEFAULTCOUNT: number = 100;
  readonly FIRSTPAGE: number = 1;
  empRealTime!: IViewEmployeeBoard[];
  empMaxCount$!: Observable<number>;
  skeletonLoader: Array<number> = [this.DEFAULTCOUNT];
  Subscriptions: Subscription[] = [];
  areaList$!: Observable<IAreaList[]>;
  locationList$!: Observable<ILocationList[]>;
  teamList$!: Observable<ITeamList[]>;
  positionList$!: Observable<IPositionList[]>;
  divisionList$!: Observable<IDivisionList[]>;
  kakariList$!: Observable<IKakariList[]>;
  selectedAreaText = 'すべて';
  filterValues: IEmployeeBoardArgs = {
    search: null,
    areaID: [],
    teamID: [],
    locID: [],
    posID: [],
    divID: [],
    kakariID: [],
    pageoffset: this.DEFAULTCOUNT,
    pagenum: this.FIRSTPAGE,
    order: null,
  };

  searchStart = false;
  viewboardStatusRatio!: IEmployeeCountRatio;
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
    this.title.setTitle('位置確認');
    this.initializeFilterValues();
    this.skeletonLoader = new Array<number>(this.filterValues.pageoffset);
    this.getCurrentFilteredCount();
    this.initializeBoardView();
  }

  filterFormGroup = new FormGroup({
    areaID: new FormControl<number[]>([]),
    locID: new FormControl<number[]>([]),
    teamID: new FormControl<number[]>([]),
    posID: new FormControl<number[]>([]),
    divID: new FormControl<number[]>([]),
    kakariID: new FormControl<number[]>([]),
  });

  @ViewChild('areaSelect') areaSelect!: MatSelect;
  @ViewChild('locSelect') locSelect!: MatSelect;
  @ViewChild('teamSelect') teamSelect!: MatSelect;
  @ViewChild('posSelect') posSelect!: MatSelect;
  @ViewChild('divSelect') divSelect!: MatSelect;
  @ViewChild('kakariSelect') kakariSelect!: MatSelect;

  selectedItem<T, K extends keyof T>(
    list$: Observable<T[]>,
    selected: number,
    key: K
  ): Observable<T[]> {
    return list$.pipe(map((data) => data.filter((i) => i[key] === selected)));
  }
  clearEachFilter(selectedviewChild: MatSelect): void {
    selectedviewChild.options.forEach((option) => option.deselect());
    this.reInitializeBoard();
  }
  returnSelectedTextFilter: ISelectedItem = {
    areaSelected: (selected: number) =>
      this.selectedItem(this.areaList$, selected, 'areaID'),
    locSelected: (selected: number) =>
      this.selectedItem(this.locationList$, selected, 'locID'),
    teamSelected: (selected: number) =>
      this.selectedItem(this.teamList$, selected, 'teamID'),
    posSelected: (selected: number) =>
      this.selectedItem(this.positionList$, selected, 'posID'),
    divSelected: (selected: number) =>
      this.selectedItem(this.divisionList$, selected, 'divID'),
    kakariSelected: (selected: number) =>
      this.selectedItem(this.kakariList$, selected, 'kakariID'),
  };

  clearFilters(): void {
    this.filterFormGroup.reset({
      areaID: [],
      locID: [],
      teamID: [],
      posID: [],
      divID: [],
      kakariID: [],
    });
    this.reInitializeBoard();
    this.setAreaName();
  }
  private initializeFilterValues(): void {
    const filterdata: string | null = this.localValue.getDefaultFilter;
    if (typeof filterdata === 'string') {
      const storedData: IFilterTypes = JSON.parse(filterdata);
      if (FilterTypes.safeParse(storedData).success)
        this.filterFormGroup.setValue(storedData);
      else
        this.appServ.tempStoreKey(
          'defaultFilter',
          JSON.stringify(this.filterFormGroup.value)
        );

      this.selectedAreaText =
        typeof this.localValue.getAreaText === 'string'
          ? this.localValue.getAreaText
          : 'すべて';
      this.filterValues = {
        areaID: storedData.areaID,
        teamID: storedData.teamID,
        locID: storedData.locID,
        posID: storedData.posID,
        order:
          typeof this.localValue.getSort === 'string'
            ? +this.localValue.getSort
            : null,
        divID: storedData.divID,
        kakariID: storedData.kakariID,
        pageoffset:
          typeof this.localValue.getPageView === 'string'
            ? +this.localValue.getPageView
            : this.DEFAULTCOUNT,
        search: null,
        pagenum:
          typeof this.localValue.getpagenum === 'string'
            ? +this.localValue.getpagenum
            : this.FIRSTPAGE,
      };
    }
  }
  private getlocalValue(): IDefaultStoreValue {
    return {
      getPageView: this.appServ.tempGetKey('pagecountview'),
      getpagenum: this.appServ.tempGetKey('pagenum'),
      getAreaText: this.appServ.tempGetKey('selectedAreaText'),
      getViewBoard: this.appServ.tempGetKey('vgrph'),
      getSort: this.appServ.tempGetKey('order'),
      getDefaultFilter: this.appServ.tempGetKey('defaultFilter'),
    };
  }

  reInitializeBoard(): void {
    this.Subscriptions.forEach((s) => s.unsubscribe());
    this.appServ.tempStoreKey(
      'defaultFilter',
      JSON.stringify(this.filterFormGroup.value)
    );
    this.appServ.tempStoreKey(
      'order',
      this.filterValues.order ? String(this.filterValues.order) : '0'
    );

    this.filterValues.pagenum = 1;
    this.appServ.tempStoreKey('pagenum', String(this.filterValues.pagenum));
    this.getCurrentFilteredCount();
    this.initializeBoardView();
    this.ViewBoardNaviComponent.rerenderpaginator();
  }
  private setTitle(): void {
    this.title.setTitle(`${this.selectedAreaText}/${this.appServ.appTitle}`);
  }

  openSearch(): void {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }

  searchClose(): void {
    this.filterValues.search = null;
    this.toggleSearch = false;
    this.reInitializeBoard();
  }

  private initializeBoardView(): void {
    this.Subscriptions.push(
      this.viewboardService
        .getRealtimeBoardView(this.viewBoardParam())
        .subscribe({
          next: (data) => {
            if (data) {
              if (data.EmployeeBoardAll.EmployeeBoardAllSub) {
                if (data.EmployeeBoardAll.EmployeeBoardAllSub.length > 0) {
                  this.empRealTime = data.EmployeeBoardAll.EmployeeBoardAllSub;
                } else this.empRealTime = [];
              }
              if (data.EmployeeBoardAll.AreaRatio)
                this.viewboardStatusRatio = data.EmployeeBoardAll.AreaRatio;
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
  sortCard(sortVal: MatRadioChange): void {
    this.filterValues.order = +sortVal.value;
    this.reInitializeBoard();
  }

  setAreaName(): void {
    const areaField: number[] | null | undefined =
      this.filterFormGroup.value.areaID;
    if (Array.isArray(areaField))
      this.Subscriptions.push(
        this.returnSelectedTextFilter
          .areaSelected(areaField?.[0])
          .subscribe((data) => {
            const othersTxt: string =
              areaField.length > 1 ? `(他+${areaField.length - 1})` : '';
            this.selectedAreaText =
              areaField.length >= 1
                ? `${data[0].areaDesc}  ${othersTxt}`
                : 'すべて';
            this.appServ.tempStoreKey(
              'selectedAreaText',
              this.selectedAreaText
            );
            this.setTitle();
          })
      );
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

  private viewDropList(): void {
    const dropDownlist = this.viewboardService
      .getViewDropList()
      .pipe(map(({ data }) => data.ViewDropList));

    this.areaList$ = this.extractListFromDropDown(dropDownlist, 'IAreaList');
    this.locationList$ = this.extractListFromDropDown(
      dropDownlist,
      'ILocationList'
    );
    this.teamList$ = this.extractListFromDropDown(dropDownlist, 'ITeamList');
    this.positionList$ = this.extractListFromDropDown(
      dropDownlist,
      'IPositionList'
    );
    this.divisionList$ = this.extractListFromDropDown(
      dropDownlist,
      'IDivisionList'
    );
    this.kakariList$ = this.extractListFromDropDown(
      dropDownlist,
      'IKakariList'
    );
  }

  private extractListFromDropDown<T>(
    dropDownlist$: Observable<any>,
    listName: string
  ): Observable<T[]> {
    return dropDownlist$.pipe(map((data) => data[listName] ?? []));
  }

  private viewBoardParam(): IEmployeeBoardArgs {
    return {
      search:
        typeof this.filterValues.search === 'string'
          ? toHalfwidthKana(this.filterValues.search)
          : null,
      areaID: this.filterFormGroup.value.areaID ?? [],
      teamID: this.filterFormGroup.value.teamID ?? [],
      locID: this.filterFormGroup.value.locID ?? [],
      order: this.filterValues.order,
      posID: this.filterFormGroup.value.posID ?? [],
      kakariID: this.filterFormGroup.value.kakariID ?? [],
      divID: this.filterFormGroup.value.divID ?? [],
      pageoffset: this.filterValues.pageoffset,
      pagenum: this.filterValues.pagenum,
    };
  }

  trackCardIndex(index: number): number {
    return index;
  }

  getPageNum(data: IPageValues): void {
    this.empRealTime = [];
    this.filterValues.pageoffset = data.pageSize;
    this.filterValues.pagenum = data.pageIndex;
    this.skeletonLoader = new Array<number>(this.filterValues.pageoffset);
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
