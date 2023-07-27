import { Component, OnDestroy, OnInit } from "@angular/core";
import { CMainService } from "./c-main.service";
import { Router } from "@angular/router";
import { Observable, Subscription, map, of } from "rxjs";
import {
  ISkeletonLoader,
  IPerAreaTotalStatistics,
  IDateSelectRes,
  IFormValues,
  ITotalArea,
} from "src/models/viewboard-model";
import * as moment from "moment";
import * as momentTimezone from "moment-timezone";
import { FormControl, FormGroup } from "@angular/forms";
import { AppService } from "src/app/app.service";
import { Title } from "@angular/platform-browser";
import * as CryptoJS from "crypto-js";
@Component({
  selector: "app-c-main-dashboard",
  templateUrl: "./c-main-dashboard.component.html",
  styleUrls: ["./c-main-dashboard.component.sass"],
  providers: [CMainService, AppService, Title],
})
export class CMainDashboardComponent implements OnInit, OnDestroy {
  readonly componentTitle: string = "Main";
  private subscriptions: Subscription[] = [];
  $totalAreaData!: Observable<IPerAreaTotalStatistics | null>;
  $pieDataSource!: Observable<ITotalArea[] | null>;
  $dropDateList!: Observable<IDateSelectRes | null>;
  maxDate = new Date();
  minDate!: Date;
  groupSelect!: FormGroup;
  readonly skeletonStyle: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "74px",
    "border-radius": "4px",
    width: "100%",
  };

  readonly skeletonPieStyle: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "300px",
    width: "300px",
    margin: "0px",
  };
  readonly skeletonTableStyle: ISkeletonLoader = {
    "background-color": "#e2e2e2",
    height: "25px",
    "border-radius": "4px",
  };

  constructor(
    private mainDashboardService: CMainService,
    private router: Router,
    private appServ: AppService,
    private title: Title
  ) {
    this.minDate = new Date(2023, 2, 1); //date when RFID system starts to operate
    const dateNow =  momentTimezone().tz("Asia/Tokyo"); 
    const sMinute = + dateNow.format("mm") >= 30 ? "30" : "00";
    const sTime = `${dateNow.format("HH")}:${sMinute}:00`;
    const sDate = dateNow.format("YYYY-MM-DD");
    this.groupSelect = new FormGroup({
      selectedDate: new FormControl<Date | null>(new Date(sDate)),
      selectedTime: new FormControl<string | null>(sTime),
    });
    this.testDecrypt();
  }
  private setTitle(): void {
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
  private testDecrypt(): void {
    const key= "3cd0b690f4395d591c6513c9af86d7fc";
    const pass = "U2FsdGVkX1%2ByXOBFkToulXdIo0aVV4qFRZ4biRF7xlA%3D";
    console.log('test')
    console.log(CryptoJS.AES.decrypt(decodeURIComponent(pass), key).toString(CryptoJS.enc.Utf8));
  }
  private getSelectedValue(): IFormValues {
    const selectedDate: string = moment(
      this.groupSelect.get("selectedDate")?.value
    ).format("YYYY-MM-DD");
    const selectedTime: string | null  =
      this.groupSelect.get("selectedTime")?.value;
    const sTime: string = selectedTime ?? "00:00:00";
    const selectedValue: string | null =
      typeof selectedTime === "string"
        ? `${selectedDate} ${selectedTime}`
        : `${selectedDate} ${moment(new Date()).format("HH")}:00:00`; 
    return {
      date: selectedDate,
      time: sTime,
      datetime: selectedValue,
    }
  }
  loadDropDateList(): void {
    const selectedDate = moment(
      this.groupSelect.get("selectedDate")?.value
    ).format("YYYY-MM-DD");

    this.$dropDateList = this.mainDashboardService
      .getDateList(selectedDate)
      .pipe(
        map(({ data }) => {
          return data ?? null;
        })
      );
    this.getPerAreaStatistics(this.getSelectedValue().datetime);
  }

  
  private getPerAreaStatistics(paramDate: string): void {
    const dateval: IFormValues = this.getSelectedValue();
    this.appServ.tempStoreKey("bdate", dateval.date);
    this.appServ.tempStoreKey("btime", dateval.time);
    this.$totalAreaData = of(null);
    this.$pieDataSource = of(null);

    const graphData: Observable<IPerAreaTotalStatistics> =
      this.mainDashboardService.getTotalArea(paramDate).pipe(
        map(({ data }) => {
          return data ?? [];
        })
      );
    this.$totalAreaData = graphData.pipe(
      map((data) => {
        return data ?? null;
      })
    );

    this.$pieDataSource = graphData.pipe(
      map((data) => {
        return data.TotalArea ?? null;
      })
    );
  }
  tableEmit(event: ITotalArea[] | null): void {
    if (Array.isArray(event)) this.$pieDataSource = of(event);
  }
  trackArea(index: number): number {
    return index;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
