import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable, shareReplay } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  IAttendanceView,
  ZAttendanceView,
} from './c-attendance-board.interface';
import { GET_ATTENDANCE_TABLE } from './c-attendance-board.gql';
import { ParseZodService } from 'src/util/parse-zod.service';

@Injectable({
  providedIn: 'root',
})
export class CAttendanceBoardService {
  constructor(private apollo: Apollo, private parseZod: ParseZodService) {}
  getAttendanceView(): QueryRef<IAttendanceView> {
    return this.apollo.watchQuery<IAttendanceView>({
      query: GET_ATTENDANCE_TABLE,
      fetchPolicy: 'cache-first',
    });
  }
  getAttendanceChanges(
    queryRef: QueryRef<IAttendanceView>
  ): Observable<ApolloQueryResult<IAttendanceView>> {
    return queryRef.valueChanges
      .pipe(shareReplay(1))
      .pipe(
        this.parseZod.parseResponse(
          ZAttendanceView,
          'Error',
          'xrf0001: Cannot get data from attendance view.'
        )
      );
  }
}
