import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  Injectable,
  OnDestroy,
} from '@angular/core';
import {
  IKetsuArgs,
  IKetsuArray,
  IKetsuData,
  IKetsuRow,
} from '../c-ketsuboard/c-ketsuboard-interface';

import {
  MatPaginatorIntl,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { ɵ$localize } from '@angular/localize';
import { IPageValues } from 'src/models/viewboard-model';
import { AppService } from 'src/app/app.service';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IDialog, ISelectedAbsentWorker } from 'src/models/dialog-model';
import { CSetabsentDialogComponent } from './c-setabsent-dialog/c-setabsent-dialog.component';
import { CKetsuboardCurrentService } from './c-ketsuboard-current.service';
import { saveAs } from 'file-saver';

@Injectable()
export class KetsuPaginator implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = ɵ$localize`一ページ目`;
  itemsPerPageLabel = ɵ$localize`ページあたりのアイテム:`;
  lastPageLabel = ɵ$localize`最後のページ`;

  nextPageLabel = '次のページ';
  previousPageLabel = '元のページ';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) return ɵ$localize`ページ 1 の 1`;

    const amountPages: number = Math.ceil(length / pageSize);
    return ɵ$localize`ページ ${page + 1} の ${amountPages}`;
  }
}

@Component({
  selector: 'app-c-ketsuboard-current',
  templateUrl: './c-ketsuboard-current.component.html',
  styleUrls: ['./c-ketsuboard-current.component.sass'],
  providers: [{ provide: MatPaginatorIntl, useClass: KetsuPaginator }],
})
export class CKetsuboardCurrentComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  @Input() DataSource!: IKetsuData | null;
  @ViewChild('paginator', { static: true })
  paginator!: MatPaginator;
  @Input() InputCurrentData!: boolean;
  @Input() InputPageView = 10;
  @Input() InputPageNum!: number | null;
  @Output() OutPageSelect = new EventEmitter<IPageValues>();
  @Output() OutRefreshData = new EventEmitter<void>();
  pageEvent!: PageEvent;
  pageIndex = 0;
  pagenum = 0;
  pageSizeOptions: number[] = [
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 500, 1000,
  ];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  tableDataSource!: IKetsuArray;
  decimalPipe = new DecimalPipe(navigator.language);
  constructor(
    private appService: AppService,
    private absentDialogBox: MatDialog,
    private ketsuService: CKetsuboardCurrentService
  ) {}
  readonly commentDialog: IDialog = {
    minWidth: '320px',
    maxWidth: '825px',
  };
  readonly currentColumns: string[] = [
    'status',
    'createdDate',
    'processName',
    'locName',
    'teamName',
    'shiftName',
    'GID',
    'displayName',
    'divName',
    'kakariDesc',
    'checkerWorkerA',
    'checkerWorkerB',
    'checkerWorkerC',
    'checkerWorkerD',
    'checkerWorkerE',
    'checkerWorkerF',
    'confirmWorker',
    'reasonDesc',
    'contactDesc',
  ];
  ngOnInit(): void {
    this.initializePagination();
  }

  openAbsentUpdateBox(data: ISelectedAbsentWorker): void {
    const dialogRef = this.absentDialogBox.open(CSetabsentDialogComponent, {
      disableClose: false,
      minWidth: this.commentDialog.minWidth,
      data: data,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.OutRefreshData.emit();
    });
  }

  pageSizeCSV = 0;
  pageIndexCSV: number | null = 0;
  subscription: Subscription[] = [];
  downloadKetsuLogsCSV(): void {
    const params: IKetsuArgs = {
      toShow: this.InputCurrentData,
      skip: this.pageIndexCSV ?? 0,
      take: this.pageSizeCSV,
    };

    this.subscription.push(
      this.ketsuService.downloadKetsuLogsCSV(params).subscribe(({ data }) => {
        if (data.DownloadKetsuLogs) {
          this.ketsuService
            .downloadCSVFileURL(data.DownloadKetsuLogs)
            .subscribe((blob) => {
              saveAs(blob, 'C製【安否確認_対応者用】.csv');
            });
        }
      })
    );
  }
  private initializePagination(): void {
    const getpagenum: string | null = this.InputCurrentData
      ? this.appService.tempGetKey('currentPageNum')
      : this.appService.tempGetKey('prevPageNum');
    this.pagenum = getpagenum ? parseInt(getpagenum) - 1 : this.pagenum;
    this.pageIndex = this.DataSource?.absentCount ?? 0;
    this.paginator._intl.itemsPerPageLabel = 'ページあたりのアイテム';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} の ${this.decimalPipe.transform(
        this.DataSource ? this.DataSource.absentCount : 0
      )}`;
    };

    this.pageSizeCSV = this.InputPageView;
    this.pageIndexCSV = this.InputPageNum;
  }

  selectedWorker(value: IKetsuRow | null): void {
    if (value && this.InputCurrentData) {
      const checkerValues = Object.entries(value)
        .filter(([key]) => key.startsWith('checker'))
        .map(([, value]) => value)
        .filter((value) => value !== null);
      const selectedData: ISelectedAbsentWorker = {
        approverEmpID: value.confirmWorkerID,
        selectedEmpID: value.empID,
        reasonID: value.reasonID,
        contactID: value.iscontactID,
        logID: value.logID,
        displayName: value.displayName,
        approverName: value.confirmWorker,
        approverList: checkerValues,
      };
      this.openAbsentUpdateBox(selectedData);
    }
  }
  handlePageEvent(e: PageEvent): void {
    if (this.InputCurrentData) {
      this.appService.tempStoreKey('currentCount', String(e.pageSize));
      this.appService.tempStoreKey('currentPageNum', String(e.pageIndex + 1));
    } else {
      this.appService.tempStoreKey('prevCount', String(e.pageSize));
      this.appService.tempStoreKey('prevPageNum', String(e.pageIndex + 1));
    }
    this.pageSizeCSV = e.pageSize;
    this.pageIndexCSV = e.pageIndex + 1;
    this.OutPageSelect.emit({
      pageIndex: e.pageIndex + 1,
      pageSize: e.pageSize,
    });
  }
  ngOnChanges(): void {
    this.tableDataSource = this.DataSource ? this.DataSource.absentData : [];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.paginator.pageIndex = this.pagenum;
    }, 0);
  }

  ngOnDestroy(): void {
    this.DataSource = {
      absentData: [],
      absentCount: null,
    };
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }
  public rerenderpaginator(): void {
    setTimeout(() => {
      this.paginator.pageIndex = 0;
    }, 0);
  }
}
