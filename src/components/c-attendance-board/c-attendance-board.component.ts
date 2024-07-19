import { Component, OnDestroy, OnInit } from '@angular/core';
import { CAttendanceBoardService } from './c-attendance-board.service';
import {
  IAttendanceView,
  ITableList,
  ITableTotal,
} from './c-attendance-board.interface';
import { Observable, map } from 'rxjs';
import { ISkeletonLoader } from 'src/models/viewboard-model';
import { QueryRef } from 'apollo-angular';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-c-attendance-board',
  templateUrl: './c-attendance-board.component.html',
  styleUrls: ['./c-attendance-board.component.sass'],
})
export class CAttendanceBoardComponent implements OnInit, OnDestroy {
  constructor(
    private attendanceBoardService: CAttendanceBoardService,
    private title: Title
  ) {}

  attendanceTotal$!: Observable<ITableTotal>;
  attendanceList$!: Observable<ITableList>;
  attendanceView$!: QueryRef<IAttendanceView>;
  readonly skeletonTableStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '25px',
    'border-radius': '4px',
  };
  ngOnInit(): void {
    this.title.setTitle('出勤率確認');
    this.initializeAttendanceTableData();
  }

  private initializeAttendanceTableData(): void {
    const perMinuteInterval: number = 1000 * 60 * 1;
    this.attendanceView$ = this.attendanceBoardService.getAttendanceView();
    this.attendanceView$.startPolling(perMinuteInterval);
    const attendanceData: Observable<IAttendanceView> =
      this.attendanceBoardService
        .getAttendanceChanges(this.attendanceView$)
        .pipe(
          map(({ data }) => {
            return data;
          })
        );
    this.attendanceTotal$ = attendanceData.pipe(
      map((data) => {
        return data.TableTotal ?? [];
      })
    );

    this.attendanceList$ = attendanceData.pipe(
      map((data) => {
        return data.TableList ?? [];
      })
    );
  }

  ngOnDestroy(): void {
    this.attendanceView$.stopPolling();
  }
}
