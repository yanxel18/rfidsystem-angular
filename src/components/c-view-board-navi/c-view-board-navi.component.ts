import { DecimalPipe } from '@angular/common';
import {
  Component,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppService } from 'src/app/app.service';
import { IPageValues } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-view-board-navi',
  templateUrl: './c-view-board-navi.component.html',
  styleUrls: ['./c-view-board-navi.component.sass'],
  providers: [AppService],
})
export class CViewBoardNaviComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator', { static: true })
  paginator!: MatPaginator;

  @Input() InputMaxCount: number | null = 0;
  @Input() InputPageView = 10;
  @Output() OutPageSelect = new EventEmitter<IPageValues>();
  @Input() InputPageNum!: number | null;
  decimalPipe = new DecimalPipe(navigator.language);
  pageIndex = 0;
  pagenum = 0;
  pageSizeOptions: number[] = [20, 30, 40, 50, 60, 70, 80, 90, 100];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent!: PageEvent;
  constructor(private appService: AppService) {}
  ngOnInit(): void {
    this.initializePagination();
  }

  private initializePagination(): void {
    const getpagenum: string | null = this.appService.tempGetKey('pagenum');
    this.pagenum = getpagenum ? parseInt(getpagenum) - 1 : this.pagenum;
    this.pageIndex = this.InputMaxCount ? this.InputMaxCount : 0;
    this.paginator._intl.itemsPerPageLabel = 'ページあたりのアイテム';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} の ${this.decimalPipe.transform(
        this.InputMaxCount ? this.InputMaxCount : 0
      )}`;
    };
  }

  handlePageEvent(e: PageEvent): void {
    this.appService.tempStoreKey('pagecountview', String(e.pageSize));
    this.appService.tempStoreKey('pagenum', String(e.pageIndex + 1));
    this.OutPageSelect.emit({
      pageIndex: e.pageIndex + 1,
      pageSize: e.pageSize,
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.paginator.pageIndex = this.pagenum;
    }, 0);
  }

  public rerenderpaginator(): void {
    setTimeout(() => {
      this.paginator.pageIndex = 0;
    }, 0);
  }
}
