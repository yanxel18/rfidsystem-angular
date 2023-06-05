import gql from "graphql-tag";

export const GET_TOTALPERAREASTAT = gql`
  query TotalArea($totalStatSelectedDate: String!, $areaSelectedDate: String!) {
    TotalArea: TotalAreaStatistic(
      totalStatSelectedDate: $totalStatSelectedDate
    ) {
      total: workerAllTotal
      percent: workerInPercentage
      workerIn: workerInTotal
    }
    PerArea: PerAreaStatistic(areaSelectedDate: $areaSelectedDate) {
      area: actualProc
      bldg: bldgName
      percent: workerInPercent
      workerIn: workerInTotal
      workerInTotal: workerTotal
    }
  }
`;

export const GET_DROPDOWN_LIST = gql`
  query DateSelectList($dateFrom: String) {
    DateList: DateSelectList(dateFrom: $dateFrom) {
      workDate: DateSelect
    }
  }
`;
