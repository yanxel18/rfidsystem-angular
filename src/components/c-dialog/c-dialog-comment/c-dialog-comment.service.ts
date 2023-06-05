import { Injectable } from "@angular/core";
import { FetchResult } from "@apollo/client/link/core";
import gql from "graphql-tag";
import { Observable } from "rxjs";
import { Apollo } from "apollo-angular";
import {
  ISelectedWorkerComment,
  ISelectedWorkerResponse,
} from "src/models/dialog-model";

const UPDATE_COMMENT = gql`
  mutation UpdateEmployeeComment($empId: String!, $comment: String) {
    UpdateEmployeeComment(empID: $empId, comment: $comment) {
      status
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class CDialogCommentService {
  constructor(private apollo: Apollo) {}

  updateComment(
    param: ISelectedWorkerComment
  ): Observable<FetchResult<ISelectedWorkerResponse>> {
    return this.apollo.mutate({
      mutation: UPDATE_COMMENT,
      variables: {
        empId: param.empID,
        comment: param.comment,
      },
    });
  }
}
