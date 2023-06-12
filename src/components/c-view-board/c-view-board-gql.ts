import gql from 'graphql-tag';

export const GET_VIEWBOARD_SUBSCRIBE = gql`
  subscription EmployeeBoardAllSub(
    $areaID: Int
    $teamID: Int
    $locID: Int
    $posID: Int
    $divID: Int
    $pageoffset: Int
    $pagenum: Int
    $search: String
    $order: Int
  ) {
    EmployeeBoardAllSub(
      areaID: $areaID
      teamID: $teamID
      locID: $locID
      posID: $posID
      divID: $divID
      pageoffset: $pageoffset
      pagenum: $pagenum
      search: $search
      order: $order
    ) {
      EmployeeBoardAllSub {
        empID
        lastUpdate
        timeElapse
        displayName
        statusID
        sign
        comment
        areaID
        areaDesc
        setAlarm
        locID
        locDesc
        floor
        buildloc
        processName
        teamID
      }
      AreaRatio {
        currentPercent
        currentWorkerCount
        totalWorkerCount
      }
    }
  }
`;
export const GET_VIEWBOARD_TEMPLATE = gql`
  query EmployeeBoardAll(
    $areaId: Int
    $teamID: Int
    $locID: Int
    $posID: Int
    $pageoffset: Int
    $pagenum: Int
    $divID: Int
    $search: String
    $order: Int
  ) {
    EmployeeBoardAll(
      areaID: $areaId
      teamID: $teamID
      locID: $locID
      posID: $posID
      divID: $divID
      pageoffset: $pageoffset
      pagenum: $pagenum
      search: $search
      order: $order
    ) {
      EmployeeBoardAllSub {
        empID
        lastUpdate
        timeElapse
        displayName
        statusID
        sign
        comment
        areaID
        areaDesc
        setAlarm
        locID
        locDesc
        floor
        buildloc
        processName
        teamID
      }
      AreaRatio {
        currentPercent
        currentWorkerCount
        totalWorkerCount
      }
    }
  }
`;

export const GET_CURRENT_EMPCOUNT = gql`
  query Query(
    $areaID: Int
    $teamID: Int
    $locID: Int
    $posID: Int
    $search: String
    $divID: Int
    $order: Int
  ) {
    EmpBoardMaxCountFilter(
      areaID: $areaID
      teamID: $teamID
      locID: $locID
      posID: $posID
      divID: $divID
      search: $search
      order: $order
    )
  }
`;
export const GET_VIEWDROPLIST = gql`
  query ViewDropList {
    ViewDropList {
      IAreaList {
        areaDesc
        areaID
      }
      ILocationList {
        buildloc
        locID
      }
      ITeamList {
        teamID
        teamName
      }
      IPositionList {
        posID
        posName
      }
      IDivisionList {
        divID
        divName
      }
    }
  }
`;
export const GET_PERAREA_GRAPH = gql`
  query Query($areaID: Int, $locID: Int, $teamID: Int) {
    PerAreaGraph(areaID: $areaID, locID: $locID, teamID: $teamID) {
      x: DateSelect
      y: WorkerRate
    }
  }
`;
