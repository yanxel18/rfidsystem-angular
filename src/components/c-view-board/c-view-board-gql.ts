import gql from 'graphql-tag';

export const GET_VIEWBOARD_SUBSCRIBE = gql`
  subscription EmployeeBoardAllSub(
    $areaID: [Int]!
    $teamID: [Int]!
    $locID: [Int]!
    $posID: [Int]!
    $divID: [Int]!
    $kakariID: [Int]!
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
      kakariID: $kakariID
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
        kakariID
        kakariDesc
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
    $areaID: [Int]!
    $teamID: [Int]!
    $locID: [Int]!
    $posID: [Int]!
    $pageoffset: Int
    $pagenum: Int
    $divID: [Int]!
    $kakariID: [Int]!
    $search: String
    $order: Int
  ) {
    EmployeeBoardAll(
      areaID: $areaID
      teamID: $teamID
      locID: $locID
      posID: $posID
      divID: $divID
      kakariID: $kakariID
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
        kakariID
        kakariDesc
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
    $areaID: [Int]!
    $teamID: [Int]!
    $locID: [Int]!
    $posID: [Int]!
    $search: String
    $divID: [Int]!
    $kakariID: [Int]!
    $order: Int
  ) {
    EmpBoardMaxCountFilter(
      areaID: $areaID
      teamID: $teamID
      locID: $locID
      posID: $posID
      divID: $divID
      kakariID: $kakariID
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
      IKakariList {
        kakariID
        kakariDesc
      }
    }
  }
`;
