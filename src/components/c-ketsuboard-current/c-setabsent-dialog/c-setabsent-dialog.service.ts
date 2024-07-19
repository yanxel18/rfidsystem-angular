import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ParseZodService } from 'src/util/parse-zod.service';
import {
  GET_ABSENTDROP_LIST,
  GET_APPROVER_LIST,
  UPDATE_ABSENT_WORKER,
} from './c-setabsent-dialog-gql';
import { Observable, shareReplay } from 'rxjs';
import { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import {
  IAbsentDropList,
  IApproverList,
  IUpdateAbsetInfoArgs,
  ZAbsentDropList,
  ZApproverList,
} from './c-setabsent-dialog-interface';
import { IAbsentWorkerResponse } from 'src/models/dialog-model';

@Injectable({
  providedIn: 'root',
})
export class CSetabsentDialogService {
  constructor(private apollo: Apollo, private parseZod: ParseZodService) {}

  getAbsentDropList(): Observable<ApolloQueryResult<IAbsentDropList>> {
    return this.apollo
      .watchQuery<IAbsentDropList>({
        query: GET_ABSENTDROP_LIST,
      })
      .valueChanges.pipe(shareReplay(1))
      .pipe(
        this.parseZod.parseResponse(
          ZAbsentDropList,
          'Error',
          'xrf0003: Cannot get reasonlist and contactlist from view.'
        )
      );
  }

  getApproverList(
    approverName: string | null
  ): Observable<ApolloQueryResult<IApproverList>> {
    return this.apollo
      .watchQuery<IApproverList>({
        query: GET_APPROVER_LIST,
        variables: {
          approverName,
        },
      })
      .valueChanges.pipe(shareReplay(1))
      .pipe(
        this.parseZod.parseResponse(
          ZApproverList,
          'Error',
          'xrf0004: Cannot get approverlist from view.'
        )
      );
  }

  updateAbsentWorker(
    param: IUpdateAbsetInfoArgs
  ): Observable<FetchResult<IAbsentWorkerResponse>> {
    return this.apollo.mutate({
      mutation: UPDATE_ABSENT_WORKER,
      variables: {
        logId: param.logID, 
        approverEmpId: param.approverEmpID,
        selectedEmpId: param.selectedEmpID,
        reasonId: param.reasonID,
        contactId: param.contactID,
      },
    });
  }
}
