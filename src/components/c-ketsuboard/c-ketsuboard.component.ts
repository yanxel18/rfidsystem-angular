import { Component, OnInit } from '@angular/core';
import { CKetsuboardService } from './c-ketsuboard.service';
import { IKetsuArgs, IKetsuData } from './c-ketsuboard-interface';
import { Observable, map } from 'rxjs';
import {
  IPageValues,
  KetsuPageValues,
  PageFilters,
} from 'src/models/viewboard-model';
import { AppService } from 'src/app/app.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-c-ketsuboard',
  templateUrl: './c-ketsuboard.component.html',
  styleUrls: ['./c-ketsuboard.component.sass'],
})
export class CKetsuboardComponent implements OnInit {
  constructor(
    private ketsuService: CKetsuboardService,
    private appServ: AppService,
    private title: Title
  ) {}
  currentAbsent$!: Observable<IKetsuData>;
  previousAbsent$!: Observable<IKetsuData>;
  readonly DEFAULTCOUNT: number = 10;
  readonly FIRSTPAGE: number = 1;
  argValues: PageFilters = {
    pageoffset: this.DEFAULTCOUNT,
    pagenum: this.FIRSTPAGE,
  };
  prevArgValues: PageFilters = {
    pageoffset: this.DEFAULTCOUNT,
    pagenum: this.FIRSTPAGE,
  };
  localValue: Partial<KetsuPageValues> = this.getLocalData();
  ngOnInit(): void {
    this.title.setTitle('対応表');
    this.initializeArgValues();
    this.initializeTables(false);
  }

  public initializeTables(refetch: boolean): void {
    this.currentAbsent$ = this.initializeAbsentTableData(
      true,
      this.argValues.pagenum,
      this.argValues.pageoffset,
      refetch
    );
    this.previousAbsent$ = this.initializeAbsentTableData(
      false,
      this.prevArgValues.pagenum,
      this.prevArgValues.pageoffset,
      refetch
    );
  }
  public initializeArgValues(): void {
    this.argValues = {
      pagenum:
        typeof this.localValue.getCurrentPageNum === 'string'
          ? +this.localValue.getCurrentPageNum
          : this.FIRSTPAGE,
      pageoffset:
        typeof this.localValue.getCurrentPageCount === 'string'
          ? +this.localValue.getCurrentPageCount
          : this.DEFAULTCOUNT,
    };
    this.prevArgValues = {
      pageoffset:
        typeof this.localValue.getPrevPageCount === 'string'
          ? +this.localValue.getPrevPageCount
          : this.DEFAULTCOUNT,
      pagenum:
        typeof this.localValue.getPrevPageNum === 'string'
          ? +this.localValue.getPrevPageNum
          : this.FIRSTPAGE,
    };
  }

  private getLocalData(): Partial<KetsuPageValues> {
    return {
      getCurrentPageCount: this.appServ.tempGetKey('currentCount'),
      getCurrentPageNum: this.appServ.tempGetKey('currentPageNum'),
      getPrevPageCount: this.appServ.tempGetKey('prevCount'),
      getPrevPageNum: this.appServ.tempGetKey('prevPageNum'),
    };
  }
  private initializeAbsentTableData(
    toShow: boolean,
    skip: number,
    take: number,
    refetch: boolean
  ): Observable<IKetsuData> {
    const ketsuArg: IKetsuArgs = {
      toShow,
      skip,
      take,
    };

    return this.ketsuService.getKetsuView(ketsuArg, refetch).pipe(
      map(({ data }) => {
        return data.KetsuTable ?? [];
      })
    );
  }

  getPageNum(data: IPageValues): void {
    this.argValues.pageoffset = data.pageSize;
    this.argValues.pagenum = data.pageIndex;
    this.initializeTables(false);
  }

  getPageNumPrev(data: IPageValues): void {
    this.prevArgValues.pageoffset = data.pageSize;
    this.prevArgValues.pagenum = data.pageIndex;
    this.initializeTables(false);
  }
}
