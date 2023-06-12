import {
  EmployeeBoardWithRatio,
  IFilteredCountRes,
  IPerAreaGraphResponse,
  IViewDropList,
  testinterface,
} from './../../models/viewboard-model';
import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  IEmployeeBoardArgs,
  IViewEmployeeBoard,
} from 'src/models/viewboard-model';

import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { MsgServiceService } from 'src/handlers/msg-service.service';
import {
  GET_CURRENT_EMPCOUNT,
  GET_PERAREA_GRAPH,
  GET_VIEWBOARD_SUBSCRIBE,
  GET_VIEWBOARD_TEMPLATE,
  GET_VIEWDROPLIST,
} from './c-view-board-gql';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class CViewBoardService implements OnDestroy {
  boardSubscription!: QueryRef<EmployeeBoardWithRatio>;
  Subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo, private msgHandler: MsgServiceService) {}
  employeeRealtimeView$!: Observable<IViewEmployeeBoard[]>;

  getFilteredCount(param: IEmployeeBoardArgs): Observable<ApolloQueryResult<IFilteredCountRes>> {
    return this.apollo.watchQuery<IFilteredCountRes>({
      query: GET_CURRENT_EMPCOUNT,
      variables: {
        search: param.search,
        areaID: param.areaID,
        teamID: param.teamID,
        locID: param.locID,
        posID: param.posID,
        divID: param.divID,
        order: param.order,
      },
    }).valueChanges.pipe(shareReplay(1));
  }

  getPerAreaGraph(
    param: IEmployeeBoardArgs
  ): Observable<ApolloQueryResult<IPerAreaGraphResponse>> {
    return this.apollo
      .watchQuery<IPerAreaGraphResponse>({
        query: GET_PERAREA_GRAPH,
        variables: {
          areaID: param.areaID,
          locID: param.locID,
          teamID: param.teamID,
        },
        pollInterval: 1000 * 60 * 5,
      })
      .valueChanges.pipe(shareReplay(1));
  }

  getViewDropList(): Observable<ApolloQueryResult<IViewDropList>> {
    return this.apollo
      .watchQuery<IViewDropList>({
        query: GET_VIEWDROPLIST,
      })
      .valueChanges.pipe(shareReplay(1));
  }
  getRealtimeBoardView(
    param: IEmployeeBoardArgs
  ): Observable<EmployeeBoardWithRatio> {
    this.boardSubscription = this.apollo.watchQuery<EmployeeBoardWithRatio>({
      query: GET_VIEWBOARD_TEMPLATE,
    });
    this.boardSubscription.subscribeToMore({
      document: GET_VIEWBOARD_SUBSCRIBE,
      variables: {
        search: param.search,
        areaID: param.areaID,
        teamID: param.teamID,
        locID: param.locID,
        posID: param.posID,
        divID: param.divID,
        order: param.order,
        pageoffset: param.pageoffset,
        pagenum: param.pagenum,
      },
      updateQuery: (prev, { subscriptionData }): any => {
        if (!subscriptionData.data) return prev;
        const receivedPayload: EmployeeBoardWithRatio =
          subscriptionData.data.EmployeeBoardAllSub;
        const returnData: testinterface = {
          ...prev,
          EmployeeBoardAll: receivedPayload,
        };
        return returnData;
      },
      onError: () => {
        this.msgHandler.generalMessage();
      },
    });
    return this.boardSubscription.valueChanges.pipe(
      map(({ data }) => {
        return data;
      })
    );
  }
  ngOnDestroy(): void {
    this.boardSubscription.stopPolling();
  }
}
