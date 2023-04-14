import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CMainService } from './c-main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { ISkeletonLoader, IPerAreaTotalStatistics } from 'src/models/viewboard-model';
import * as moment from 'moment';

@Component({
  selector: 'app-c-main-dashboard',
  templateUrl: './c-main-dashboard.component.html',
  styleUrls: ['./c-main-dashboard.component.sass'],
  providers: [CMainService]
})
export class CMainDashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  $totalAreaData!: Observable<IPerAreaTotalStatistics | null>;
  skeletonStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '74px',
    'border-radius': '4px',
    width: '100%'
  } 

  skeletonPieStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '300px', 
    width: '300px',
    margin: '0px'
  } 
  skeletonTableStyle: ISkeletonLoader = {
    'background-color': '#e2e2e2',
    height: '25px',
    'border-radius': '4px', 
  } 

  constructor(
    private mainDashboardService: CMainService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) {}


  async ngOnInit(): Promise<void> { 
    this.subscriptions.push(this.activeroute.queryParams.subscribe(params => {
      params['date']
    }));
    this.mainDashboardService.getTotalArea("2023-03-24 10:00:00").refetch();
    this.$totalAreaData = this.mainDashboardService
    .getTotalArea("2023-03-24 10:00:00")
    .valueChanges.pipe( // FIX THE PARAM IF NULL OR NOTHING?!?!!!!!!!!
      map(({ data }) => {
        return data ? data : null;
      })
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  trackArea(index: number): number {
    return index;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
