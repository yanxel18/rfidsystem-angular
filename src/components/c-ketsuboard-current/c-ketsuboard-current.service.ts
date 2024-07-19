import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable, shareReplay } from 'rxjs';
import { DOWNLOAD_KETSU_LOG } from './c-ketsuboard-current-gql';
import { IDownloadKetsuLogs } from './c-setabsent-dialog/c-setabsent-dialog-interface';
import { IKetsuArgs } from '../c-ketsuboard/c-ketsuboard-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CKetsuboardCurrentService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  downloadKetsuLogsCSV(
    param: IKetsuArgs
  ): Observable<ApolloQueryResult<IDownloadKetsuLogs>> {
    return this.apollo
      .watchQuery<IDownloadKetsuLogs>({
        query: DOWNLOAD_KETSU_LOG,
        variables: {
          toShow: param.toShow,
          skip: param.skip,
          take: param.take,
        },
      })
      .valueChanges.pipe(shareReplay(1));
  }

  downloadCSVFileURL(csvURL: string): Observable<Blob> {
    return this.http.get<any>(csvURL, { responseType: 'blob' as 'json' });
  }
}
