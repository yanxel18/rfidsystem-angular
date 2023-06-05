import {
  IDateSelectRes,
  IPerAreaTotalStatistics

} from './../../models/viewboard-model';
import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';


const GET_TOTALPERAREASTAT = gql`
  query TotalArea($totalStatSelectedDate: String!, $areaSelectedDate: String!) {
   TotalArea:TotalAreaStatistic(totalStatSelectedDate: $totalStatSelectedDate) {
    total:workerAllTotal
    percent:workerInPercentage
    workerIn:workerInTotal
  }
  PerArea:PerAreaStatistic(areaSelectedDate: $areaSelectedDate) {
    area:actualProc
    bldg:bldgName
    percent:workerInPercent
    workerIn:workerInTotal
    workerInTotal:workerTotal
  }
}`

const GET_DROPDOWN_LIST = gql`
  query DateSelectList($dateFrom: String) {
    DateList:DateSelectList(dateFrom: $dateFrom) {
      workDate:DateSelect
    }
}`
@Injectable({
  providedIn: 'root'
})
export class CMainService {

  constructor(private apollo: Apollo) { }

  getTotalArea(selectedDate: string): QueryRef<IPerAreaTotalStatistics> {
    return this.apollo.watchQuery<IPerAreaTotalStatistics>({
        query: GET_TOTALPERAREASTAT,
        variables: {
          totalStatSelectedDate: selectedDate,
          areaSelectedDate: selectedDate
        }
    })
  }
  getDateList(selectedDate: string | null | undefined): QueryRef<IDateSelectRes> {
    return this.apollo.watchQuery<IDateSelectRes>({
        query: GET_DROPDOWN_LIST,
        variables: { 
          dateFrom: selectedDate
        }
    })
  }
}
