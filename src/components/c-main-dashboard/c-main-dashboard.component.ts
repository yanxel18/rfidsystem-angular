import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CMainService } from './c-main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import {
  ISkeletonLoader,
  IPerAreaTotalStatistics,
  IDateSelectRes,
  IFormValues,
} from 'src/models/viewboard-model';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-c-main-dashboard',
  templateUrl: './c-main-dashboard.component.html',
  styleUrls: ['./c-main-dashboard.component.sass'],
  providers: [CMainService],
})
export class CMainDashboardComponent implements OnInit, OnDestroy{
  subscriptions: Subscription[] = [];
  $totalAreaData!: Observable<IPerAreaTotalStatistics | null>;
  $dropDateList!: Observable<IDateSelectRes >;
 
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
    private activeroute: ActivatedRoute,
    private appServ: AppService
  ) {
    this.minDate = new Date(2023, 2, 1);
    const btime: string | null = this.appServ.tempGetKey('btime');
    const bdate: string | null = this.appServ.tempGetKey('bdate');
    const sTime: string = btime ? btime : `${moment(new Date()).format('HH')}:00:00`
    const sDate = bdate ? bdate : moment().format('YYYY-MM-DD');
    this.groupSelect = new FormGroup({
      selectedDate: new FormControl<Date | null>(new Date(sDate)),
      selectedTime: new FormControl<string | null>(sTime),
    });
  }

  getSelectedDate(): void {
    this.getPerAreaStatistics(this.getSelectedValue().datetime);
  }
  async ngOnInit(): Promise<void> {
    this.loadDropDateList();
    this.subscriptions.push(
      this.activeroute.queryParams.subscribe((params) => {
        params['date'];
      })
    );
    this.getPerAreaStatistics(this.getSelectedValue().datetime);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  getSelectedValue(): IFormValues {
    const selectedDate: string = moment(
      this.groupSelect.get('selectedDate')?.value
    ).format('YYYY-MM-DD');
    const selectedTime: String | null | undefined =
      this.groupSelect.get('selectedTime')?.value;
    const sTime: string = selectedTime ? selectedTime.toString() : "00:00:00";
    const selectedValue: string | null = selectedTime
      ? `${selectedDate} ${selectedTime}`
      : `${selectedDate} ${moment(new Date()).format('HH')}:00:00`; 

    const retVal: IFormValues = {
      date: selectedDate,
      time:  sTime,
      datetime: selectedValue
    }
    return retVal;
  }
  loadDropDateList(): void {
    const selectedDate = moment(
      this.groupSelect.get('selectedDate')?.value
    ).format('YYYY-MM-DD'); 
    this.mainDashboardService.getDateList(null).refetch();
    this.$dropDateList = this.mainDashboardService
      .getDateList(selectedDate)
      .valueChanges.pipe(
        map(({ data }) => {
          return data
        })
      );
    this.getPerAreaStatistics(this.getSelectedValue().datetime);
  }
  getPerAreaStatistics(paramDate: String): void {
    const dateval:  IFormValues = this.getSelectedValue();
    this.appServ.tempStoreKey('bdate', dateval.date);
    this.appServ.tempStoreKey('btime',dateval.time)
    this.$totalAreaData = this.mainDashboardService
      .getTotalArea(paramDate)
      .valueChanges.pipe( 
        map(({ data }) => {
          return data ? data : null;
        })
      );
  }
  trackArea(index: number): number {
    return index;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

}
