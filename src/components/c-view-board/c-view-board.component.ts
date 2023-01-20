import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Apollo , QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { IViewEmployeeBoard, IViewEmployeeBoardRes } from 'src/models/viewboard-model';
const GET_VIEWBOARD = gql`
subscription EmployeeBoardAllSub {
  EmployeeBoardAllSub {
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
const GET_VIEWBOARD2 = gql`
query EmployeeBoardAll {
  EmployeeBoardAll {
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
  commentsQuery: QueryRef<any>;
  comments: Observable<any> | undefined;
  constructor(private appService: AppService,
    private apollo: Apollo) {

        this.commentsQuery = apollo.watchQuery({
          query: GET_VIEWBOARD2
        }) 
    }
  //queryRef: QueryRef<any>;
  viewBoard$!: Observable<IViewEmployeeBoard[]>;

  async ngOnInit(): Promise<void> {
    // this.viewBoard$ = this.appService.getViewBoard().valueChanges.pipe(
    //   map(({ data }) => {
    //     return data.EmployeeBoardAll;
    //   })
    // )

    this.getRealtimeBoardView();

    // this.appService.getViewBoard().valueChanges.subscribe((response) => {
    //   console.log(response.data)
    // })
  }
  getViewBoard(): QueryRef<IViewEmployeeBoardRes[]> {
    return this.apollo.watchQuery<IViewEmployeeBoardRes[]>({
      query: GET_VIEWBOARD, 
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    });
  }
  getRealtimeBoardView(): void {
     
   this.commentsQuery?.subscribeToMore({
      document: GET_VIEWBOARD, 
      variables: {
        postID: 1243
      },
      updateQuery: (prev, { subscriptionData }): any => {
        if (!subscriptionData.data) {
          return prev;
        }
        const EmployeeBoardAll: IViewEmployeeBoard[]  = (subscriptionData.data).EmployeeBoardAllSub;   
 
        return { ...prev,
          EmployeeBoardAll: EmployeeBoardAll
        }

        // return  Object.assign({EmployeeBoardAll: {
        //   empID: null,
        //   tagID: null,
        //   lastUpdate: null,
        //   timeElapse: null,
        //   displayName: null,
        //   statusID: null,
        //   sign: null,
        //   readwriterID: null,
        //   comment: null,
        //   areaID: null,
        //   areaDesc: null,
        //   alarm: null,
        //   setAlarm: null,
        //   setCount: null,
        //   locID: null,
        //   locDesc: null,
        //   floor: null,
        //   empProcessID: null,
        //   processName: null,
        //   teamID: null,
        //   teamName: null,
        //   leaveStart: null,
        //   leaveEnd: null,
        //   leaveType: null,
        // }}, prev, EmployeeBoardAll)
      },
    })

 
 
   this.todoQuery$ = this.commentsQuery.valueChanges.pipe(map(({ data }) => {
    return data.EmployeeBoardAll;
  })) 


  } 
}
