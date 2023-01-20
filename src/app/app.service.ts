import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular'; 
import { IViewEmployeeBoardRes } from 'src/models/viewboard-model';

const GET_VIEWBOARD = gql`  
subscription EmployeeBoardAllSub {
    empID
    tagID
    lastUpdate
}
`;
@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private apollo: Apollo) {}

  getViewBoard(): QueryRef<IViewEmployeeBoardRes[]> {
    return this.apollo.watchQuery<IViewEmployeeBoardRes[]>({
      query: GET_VIEWBOARD
    });
  }


  
}
