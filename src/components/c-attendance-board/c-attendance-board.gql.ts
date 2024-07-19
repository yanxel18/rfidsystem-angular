import gql from 'graphql-tag';
export const GET_ATTENDANCE_TABLE = gql`
  query AttendanceView {
    TableTotal: AttendanceTableTotal {
      workerInTotal
      workerAllTotal
      workerInPercent
      totalTeamName
    }
    TableList: AttendanceTableList {
      divID
      divName
      kakariID
      kakariDesc
      koutaiInCount
      koutaiTotalCount
      koutaiPercent
      dayShiftInCount
      dayShiftTotalCount
      dayShiftPercent
      normalShiftInCount
      normalShiftTotalCount
      normalShiftPercent
    }
  }
`;
