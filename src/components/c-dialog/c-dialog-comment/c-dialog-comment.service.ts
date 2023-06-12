import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/link/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  ISelectedWorkerComment,
  ISelectedWorkerResponse,
} from 'src/models/dialog-model';
import { UPDATE_COMMENT } from './c-dialog-comment-gql';

@Injectable({
  providedIn: 'root',
})
export class CDialogCommentService {
  constructor(private apollo: Apollo) {}

  /**
   *
   * @param param received comment data
   * @returns response object
   */
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
