import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  IEmployeeBoardArgs,
  IViewEmployeeBoard,
  IViewEmployeeBoardRes,
} from 'src/models/viewboard-model';
import gql from 'graphql-tag';
import { Observable, map } from 'rxjs';
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
@Injectable({
  providedIn: 'root',
})
export class CViewBoardService {
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

  getRealtimeBoardView(param: IEmployeeBoardArgs): Observable<IViewEmployeeBoard[]> {
    const t : QueryRef<IViewEmployeeBoardRes>=  this.apollo.watchQuery<IViewEmployeeBoardRes>({
        query: GET_VIEWBOARD_TEMPLATE
      }); 
     t.subscribeToMore({
      document: GET_VIEWBOARD_SUBSCRIBE,
      variables: {
        areaID: param.areaID,
        teamID: param.teamID,
        locID: param.locID,
        pageoffset: param.pageoffset,
        pagenum: param.pagenum
      },
      updateQuery: (prev, { subscriptionData }): any => {
        if (!subscriptionData.data) {
          return prev;
        }
        const EmployeeBoardAll: IViewEmployeeBoard[] =
          subscriptionData.data.EmployeeBoardAllSub;
        return { ...prev, EmployeeBoardAll: EmployeeBoardAll };
      },
    }); 
    return  t.valueChanges.pipe(map(({ data }) => {
      return data.EmployeeBoardAll;
    })) 
  }
}
