import {
  IDateSelectRes,
  IPerAreaTotalStatistics,
} from './../../models/viewboard-model';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GET_TOTALPERAREASTAT,
  GET_DROPDOWN_LIST,
} from './c-main-dashboard-gql';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class CMainService {
  constructor(private apollo: Apollo) {}

  getTotalArea(
    selectedDate: string
  ): Observable<ApolloQueryResult<IPerAreaTotalStatistics>> {
    return this.apollo
      .watchQuery<IPerAreaTotalStatistics>({
        query: GET_TOTALPERAREASTAT,
        variables: {
          totalStatSelectedDate: selectedDate,
          areaSelectedDate: selectedDate,
        },
      })
      .valueChanges.pipe(shareReplay(1));
  }
  getDateList(
    selectedDate: string | null | undefined
  ): Observable<ApolloQueryResult<IDateSelectRes>> {
    return this.apollo
      .watchQuery<IDateSelectRes>({
        query: GET_DROPDOWN_LIST,
        variables: {
          dateFrom: selectedDate,
        },
      })
      .valueChanges.pipe(shareReplay(1));
  }
}
