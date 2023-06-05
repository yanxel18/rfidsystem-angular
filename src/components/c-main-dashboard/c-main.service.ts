import {
  IDateSelectRes,
  IPerAreaTotalStatistics,
} from "./../../models/viewboard-model";
import { Injectable } from "@angular/core";
import { Apollo, QueryRef } from "apollo-angular";
import {
  GET_TOTALPERAREASTAT,
  GET_DROPDOWN_LIST,
} from "./c-main-dashboard-gql";

@Injectable({
  providedIn: "root",
})
export class CMainService {
  constructor(private apollo: Apollo) {}

  getTotalArea(selectedDate: string): QueryRef<IPerAreaTotalStatistics> {
    return this.apollo.watchQuery<IPerAreaTotalStatistics>({
      query: GET_TOTALPERAREASTAT,
      variables: {
        totalStatSelectedDate: selectedDate,
        areaSelectedDate: selectedDate,
      },
    });
  }
  getDateList(
    selectedDate: string | null | undefined
  ): QueryRef<IDateSelectRes> {
    return this.apollo.watchQuery<IDateSelectRes>({
      query: GET_DROPDOWN_LIST,
      variables: {
        dateFrom: selectedDate,
      },
    });
  }
}
