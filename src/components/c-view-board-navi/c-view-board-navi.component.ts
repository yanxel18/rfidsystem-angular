import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { IPageValues } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-view-board-navi',
  templateUrl: './c-view-board-navi.component.html',
  styleUrls: ['./c-view-board-navi.component.sass']
})
export class CViewBoardNaviComponent implements OnInit {
  @ViewChild('paginator', { static: true }) 
  paginator!: MatPaginator;

  @Input() InputMaxCount: number  | null= 0;
  @Input() InputPageView: number = 10;
  @Output() OutPageSelect = new EventEmitter<IPageValues>();
  decimalPipe = new DecimalPipe(navigator.language); 
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15, 20,25,30];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent!: PageEvent;
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'ページあたりのアイテム';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} の ${this.decimalPipe.transform(this.InputMaxCount)}`;
    }; 
  }
  handlePageEvent(e: PageEvent) { 
    localStorage.setItem('pagecountview',(e.pageSize).toString());
    localStorage.setItem('pagenum',(e.pageIndex + 1).toString());
    this.OutPageSelect.emit({
      pageIndex: e.pageIndex + 1,
      pageSize: e.pageSize
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
}
