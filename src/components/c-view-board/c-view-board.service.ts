import {
  EmployeeBoardWithRatio,
  IFilteredCountRes, 
  IPerAreaGraphResponse, 
  IViewDropList,
  perAreaArgs,
} from './../../models/viewboard-model';
import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  IEmployeeBoardArgs,
  IViewEmployeeBoard,
} from 'src/models/viewboard-model';
import gql from 'graphql-tag';
import { Observable, Subscription, map } from 'rxjs';
import { MsgServiceService } from 'src/handlers/msg-service.service';
const GET_VIEWBOARD_SUBSCRIBE = gql`
  subscription EmployeeBoardAllSub(
    $areaID: Int
    $teamID: Int
    $locID: Int
    $pageoffset: Int
    $pagenum: Int
  ) {
    EmployeeBoardAllSub(
      areaID: $areaID
      teamID: $teamID
      locID: $locID
      pageoffset: $pageoffset
      pagenum: $pagenum
    ) {
      EmployeeBoardAllSub {
        empID
        lastUpdate
        timeElapse
        displayName
        statusID
        sign
        comment
        areaID
        areaDesc
        setAlarm
        locID
        locDesc
        floor
        buildloc
        processName
        teamID
      }
      AreaRatio {
        currentPercent
        currentWorkerCount
        totalWorkerCount
      }
    }
  }
`;
const GET_VIEWBOARD_TEMPLATE = gql`
  query EmployeeBoardAll(
    $areaId: Int
    $teamID: Int
    $locID: Int
    $pageoffset: Int
    $pagenum: Int
  ) {
    EmployeeBoardAll(
      areaID: $areaId
      teamID: $teamID
      locID: $locID
      pageoffset: $pageoffset
      pagenum: $pagenum
    ) {
      EmployeeBoardAllSub {
        empID
        lastUpdate
        timeElapse
        displayName
        statusID
        sign
        comment
        areaID
        areaDesc
        setAlarm
        locID
        locDesc
        floor
        buildloc
        processName
        teamID
      }
      AreaRatio {
        currentPercent
        currentWorkerCount
        totalWorkerCount
      }
    }
  }
`;

const GET_CURRENT_EMPCOUNT = gql`
  query Query($areaID: Int, $teamID: Int, $locID: Int) {
    EmpBoardMaxCountFilter(areaID: $areaID, teamID: $teamID, locID: $locID)
  }
`;
const GET_VIEWDROPLIST = gql`
  query ViewDropList {
    ViewDropList {
      IAreaList {
        areaDesc
        areaID
      }
      ILocationList {
        buildloc
        locID
      }
      ITeamList {
        teamID
        teamName
      }
    }
  }
`;
const GET_PERAREA_GRAPH = gql`
  query Query($areaId: Int, $locationId: Int,$teamId: Int) {
    PerAreaGraph(areaID: $areaId, locationID: $locationId,teamID: $teamId) {
      x:DateSelect
      y:WorkerRate
    }
  }
`;


@Injectable({
  providedIn: 'root',
})
export class CViewBoardService implements OnDestroy {
  boardSubscription!: QueryRef<EmployeeBoardWithRatio>;
  Subscriptions: Subscription[] = [];
  constructor(private apollo: Apollo, private msgHandler: MsgServiceService) {}
  employeeRealtimeView$!: Observable<IViewEmployeeBoard[]>;

  getFilteredCount(param: IEmployeeBoardArgs): QueryRef<IFilteredCountRes> {
    return this.apollo.watchQuery<IFilteredCountRes>({
      query: GET_CURRENT_EMPCOUNT,
      variables: {
        areaID: param.areaID,
        teamID: param.teamID,
        locID: param.locID,
      },
    });
  }

 getPerAreaGraph(param: perAreaArgs): QueryRef<IPerAreaGraphResponse> {
  return this.apollo.watchQuery<IPerAreaGraphResponse>({
    query: GET_PERAREA_GRAPH,
    variables: {
      areaId: param.areaId,
      locationId: param.locationId,
      teamId: param.teamId
    },
    pollInterval: (1000 * 60 *5)
  })
 }

  getViewDropList(): QueryRef<IViewDropList> {
    return this.apollo.watchQuery<IViewDropList>({
      query: GET_VIEWDROPLIST,
    });
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
        areaID: param.areaID,
        teamID: param.teamID,
        locID: param.locID,
        pageoffset: param.pageoffset,
        pagenum: param.pagenum,
      },
      updateQuery: (prev, { subscriptionData }): any => {
        if (!subscriptionData.data) {
          return prev;
        }
        const receivedPayload: EmployeeBoardWithRatio =
          subscriptionData.data.EmployeeBoardAllSub;
        return { ...prev, EmployeeBoardAll: receivedPayload };
      },
      onError: (err) => {
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
    // this.viewSubscription.forEach((s) => s.unsubscribe());
  }
}
 