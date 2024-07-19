import { Injectable } from '@angular/core';
import { ParseZodService } from 'src/util/parse-zod.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable, shareReplay } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_ABSENT_DATA } from './c-ketsuboard.gql';
import {
  IKetsuArgs,
  IKetsuReturn,
  ZKetsuReturn,
} from './c-ketsuboard-interface';

@Injectable({
  providedIn: 'root',
})
export class CKetsuboardService {
  constructor(private apollo: Apollo, private parseZod: ParseZodService) {}

  getKetsuView(
    param: IKetsuArgs,
    refetch: boolean
  ): Observable<ApolloQueryResult<IKetsuReturn>> {
    const data = this.apollo.watchQuery<IKetsuReturn>({
      query: GET_ABSENT_DATA,
      variables: {
        toShow: param.toShow,
        skip: param.skip,
        take: param.take,
      },
    });
    if (refetch) data.refetch();
    return data.valueChanges
      .pipe(shareReplay(1))
      .pipe(
        this.parseZod.parseResponse(
          ZKetsuReturn,
          'Error',
          'xrf0004: Cannot Refetch Data.'
        )
      );
  }
}
