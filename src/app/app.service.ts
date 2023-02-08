import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular'; 
 

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
 


  
}
