import { IResponseGetEmpCount } from './../../models/viewboard-model';
import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  IEmployeeBoardArgs,
  IViewEmployeeBoard,
  IViewEmployeeBoardRes,
} from 'src/models/viewboard-model';
import gql from 'graphql-tag';
import { Observable, Subscription, map } from 'rxjs';
const GET_VIEWBOARD_SUBSCRIBE = gql`
  subscription EmployeeBoardAllSub($areaID: Int, $teamID: Int, $locID: Int, $pageoffset: Int, $pagenum: Int) {
    EmployeeBoardAllSub(areaID: $areaID,teamID: $teamID,locID: $locID, pageoffset: $pageoffset,pagenum: $pagenum) {
      empID
      tagID
      lastUpdate
      timeElapse
      displayName
      statusID
      sign
      readwriterID
      comment
      areaID
      areaDesc
      alarm
      setAlarm
      setCount
      locID
      locDesc
      floor
      buildloc
      empProcessID
      processName
      teamID
      teamName
      leaveStart
      leaveEnd
      leaveType
    }
  }
`;
const GET_VIEWBOARD_TEMPLATE = gql`
  query EmployeeBoardAll($areaId: Int, $teamID: Int, $locID: Int, $pageoffset: Int, $pagenum: Int) {
    EmployeeBoardAll(areaID: $areaId,teamID: $teamID,locID: $locID, pageoffset: $pageoffset,pagenum: $pagenum) {
      empID
      tagID
      lastUpdate
      timeElapse
      displayName
      statusID
      sign
      readwriterID
      comment
      areaID
      areaDesc
      alarm
      setAlarm
      setCount
      locID
      locDesc
      floor
      buildloc
      empProcessID
      processName
      teamID
      teamName
      leaveStart
      leaveEnd
      leaveType
    }
  }
`;

const GET_EMP_COUNT = gql`
      query Query {
        EmpCount
    } 
`;
@Injectable({
  providedIn: 'root',
})
export class CViewBoardService implements OnDestroy {
  boardSubscription !: QueryRef<IViewEmployeeBoardRes>;
  Subscriptions : Subscription [] = [];
  constructor(private apollo: Apollo) {}
  employeeRealtimeView$!: Observable<IViewEmployeeBoard[]>;

  // getEmployeeBoardAll(): QueryRef<IViewEmployeeBoardRes> {
  //   return this.apollo.watchQuery<IViewEmployeeBoardRes>({
  //     query: GET_VIEWBOARD_TEMPLATE,
  //     variables: {
  //       areaID: null
  //     },
  //   });
  // }
  getEmpCount(): QueryRef<IResponseGetEmpCount> {
    return this.apollo.watchQuery<IResponseGetEmpCount>(
      {
        query: GET_EMP_COUNT
      }
    );
  }
  getRealtimeBoardView(param: IEmployeeBoardArgs): Observable<IViewEmployeeBoard[]> {
      this.boardSubscription = this.apollo.watchQuery<IViewEmployeeBoardRes>({
        query: GET_VIEWBOARD_TEMPLATE
      }); 
      this.boardSubscription.subscribeToMore({
      document: GET_VIEWBOARD_SUBSCRIBE,
      variables: {
        areaID: param.areaID,
        teamID: param.teamID,
        locID: param.locID,
        pageoffset: param.pageoffset,
        pagenum: param.pagenum
      },
      updateQuery: (prev, { subscriptionData }): any => {
        if (!subscriptionData.data.EmployeeBoardAllSub) {
          return prev;
        }
        const EmployeeBoardAll: IViewEmployeeBoard[] =
          subscriptionData.data.EmployeeBoardAllSub;
        return { ...prev, EmployeeBoardAll: EmployeeBoardAll };
      },
    }); 
    return  this.boardSubscription.valueChanges.pipe(map(({ data }) => {
      return data.EmployeeBoardAll;
    })) 
  }

  ngOnDestroy(): void {
    this.boardSubscription.stopPolling();
   // this.viewSubscription.forEach((s) => s.unsubscribe());
  }
}
