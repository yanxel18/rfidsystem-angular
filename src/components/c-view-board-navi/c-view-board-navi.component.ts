import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { IPageValues } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-view-board-navi',
  templateUrl: './c-view-board-navi.component.html',
  styleUrls: ['./c-view-board-navi.component.sass']
})
export class CViewBoardNaviComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator', { static: true }) 
  paginator!: MatPaginator;

  @Input() InputMaxCount: number  | null= 0;
  @Input() InputPageView: number = 10; 
  @Output() OutPageSelect = new EventEmitter<IPageValues>();
  @Input() InputPageNum!: number | null;
  decimalPipe = new DecimalPipe(navigator.language); 
  pageIndex: number = 0;
  pagenum: number = 0;
  pageSizeOptions : number[]= [20,30,40,50,60,70,80,90,100];

  hidePageSize : boolean= false;
  showPageSizeOptions: boolean = true;
  showFirstLastButtons: boolean = true;
  disabled: boolean = false;

  pageEvent!: PageEvent;
  ngOnInit(): void {
    const getpagenum: string | null = localStorage?.getItem('pagenum');
    this.pagenum = getpagenum ? parseInt(getpagenum)  - 1: this.pagenum;
    this.pageIndex = this.InputMaxCount ?  this.InputMaxCount : 0; 
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
  ngAfterViewInit(): void{ 
    setTimeout(() => {
    this.paginator.pageIndex = this.pagenum;
  }, 0);
  }
  public rerenderpaginator(): void{
    setTimeout(() => {
      this.paginator.pageIndex = 0;
    }, 0);
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
}
