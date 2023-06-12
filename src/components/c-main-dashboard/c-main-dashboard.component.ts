import { Component, OnDestroy, OnInit } from '@angular/core';
import { CMainService } from './c-main.service';
import { Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import {
  ISkeletonLoader,
  IPerAreaTotalStatistics,
  IDateSelectRes,
  IFormValues,
  ITotalArea,
} from 'src/models/viewboard-model';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-c-main-dashboard',
  templateUrl: './c-main-dashboard.component.html',
  styleUrls: ['./c-main-dashboard.component.sass'],
  providers: [CMainService, AppService, Title],
})
export class CMainDashboardComponent implements OnInit, OnDestroy {
  componentTitle = 'Main';
  private subscriptions: Subscription[] = [];
  $totalAreaData!: IPerAreaTotalStatistics | null;
  $pieDataSource!: ITotalArea[] | null;
  $dropDateList!: Observable<IDateSelectRes>;
  maxDate = new Date();
  minDate!: Date;
  groupSelect!: FormGroup;
  skeletonStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '74px',
    'border-radius': '4px',
    width: '100%',
  };

  skeletonPieStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '300px',
    width: '300px',
    margin: '0px',
  };
  skeletonTableStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '25px',
    'border-radius': '4px',
  };

  constructor(
    private mainDashboardService: CMainService,
    private router: Router,
    private appServ: AppService,
    private title: Title
  ) {
    this.minDate = new Date(2023, 2, 1); //date when RFID system starts to operate
    const btime: string | null = this.appServ.tempGetKey('btime');
    const bdate: string | null = this.appServ.tempGetKey('bdate');
    const sTime: string = btime
      ? btime
      : `${moment(new Date()).format('HH')}:00:00`;
    const sDate = bdate ? bdate : moment().format('YYYY-MM-DD');
    this.groupSelect = new FormGroup({
      selectedDate: new FormControl<Date | null>(new Date(sDate)),
      selectedTime: new FormControl<string | null>(sTime),
    });
  }
  setTitle(): void {
    this.title.setTitle(`${this.componentTitle}-${this.appServ.appTitle}`);
  }
  getSelectedDate(): void {
    this.getPerAreaStatistics(this.getSelectedValue().datetime);
  }
  ngOnInit(): void {
    this.loadDropDateList();
    this.getPerAreaStatistics(this.getSelectedValue().datetime);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.setTitle();
  }

  getSelectedValue(): IFormValues {
    const selectedDate: string = moment(
      this.groupSelect.get('selectedDate')?.value
    ).format('YYYY-MM-DD');
    const selectedTime: string | null | undefined =
      this.groupSelect.get('selectedTime')?.value;
    const sTime: string = selectedTime ? selectedTime.toString() : '00:00:00';
    const selectedValue: string | null = selectedTime
      ? `${selectedDate} ${selectedTime}`
      : `${selectedDate} ${moment(new Date()).format('HH')}:00:00`;

    const retVal: IFormValues = {
      date: selectedDate,
      time: sTime,
      datetime: selectedValue,
    };
    return retVal;
  }
  loadDropDateList(): void {
    const selectedDate = moment(
      this.groupSelect.get('selectedDate')?.value
    ).format('YYYY-MM-DD');

    this.$dropDateList = this.mainDashboardService
      .getDateList(selectedDate)
      .pipe(
        map(({ data }) => {
          return data;
        })
      );
    this.getPerAreaStatistics(this.getSelectedValue().datetime);
  }
  getPerAreaStatistics(paramDate: string): void {
    const dateval: IFormValues = this.getSelectedValue();
    this.appServ.tempStoreKey('bdate', dateval.date);
    this.appServ.tempStoreKey('btime', dateval.time);
    this.$totalAreaData = null;
    this.$pieDataSource = null;
    this.subscriptions.push(
      this.mainDashboardService
        .getTotalArea(paramDate)
        .subscribe(({ data }) => {
          if (data) {
            this.$totalAreaData = data;
            this.$pieDataSource = data.TotalArea;
          }
        })
    );
  }
  tableEmit(event: ITotalArea[] | null): void {
    if (Array.isArray(event)) this.$pieDataSource = event;
  }
  trackArea(index: number): number {
    return index;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
