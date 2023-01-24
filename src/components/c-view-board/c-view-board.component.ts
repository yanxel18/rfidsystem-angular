import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Apollo , QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { IViewEmployeeBoard, IViewEmployeeBoardRes } from 'src/models/viewboard-model';
const GET_VIEWBOARD_SUBSCRIBE = gql`
subscription EmployeeBoardAllSub ($areaID: Int) {
  EmployeeBoardAllSub (areaID: $areaID) {
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
query EmployeeBoardAll($areaId: Int) {
  EmployeeBoardAll(areaID: $areaId) {
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
@Component({
  selector: 'app-c-view-board',
  templateUrl: './c-view-board.component.html',
  styleUrls: ['./c-view-board.component.sass'],
})
export class CViewBoardComponent implements OnInit {
  todoQuery$!: Observable<IViewEmployeeBoard[]>;
  comments: Observable<any> | undefined;
  constructor(private appService: AppService,
    private apollo: Apollo) {
    }
  viewBoard$!: Observable<IViewEmployeeBoard[]>;

  async ngOnInit(): Promise<void> {
    this.getRealtimeBoardView();
  }
  getViewBoard(): QueryRef<IViewEmployeeBoardRes> {
    return this.apollo.watchQuery<IViewEmployeeBoardRes>({
      query: GET_VIEWBOARD_TEMPLATE,
      variables: {
        areaID: null
      } 
    });
  }

  getRealtimeBoardView(): void {
   this.getViewBoard().subscribeToMore({
      document: GET_VIEWBOARD_SUBSCRIBE, 
      variables: {
        areaID: null
      },
      updateQuery: (prev, { subscriptionData }): any => {
        if (!subscriptionData.data) {
          return prev;
        }
        const EmployeeBoardAll: IViewEmployeeBoard[]  = (subscriptionData.data).EmployeeBoardAllSub;   
        return { ...prev,
          EmployeeBoardAll: EmployeeBoardAll
        } 
      },
    })
   this.todoQuery$ = this.getViewBoard().valueChanges.pipe(map(({ data }) => {
    return data.EmployeeBoardAll;
  })) 


  } 
}
