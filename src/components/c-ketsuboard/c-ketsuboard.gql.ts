import gql from 'graphql-tag';
export const GET_ABSENT_DATA = gql`
  query KetsuTable($toShow: Boolean!, $skip: Int, $take: Int) {
    KetsuTable(toShow: $toShow, skip: $skip, take: $take) {
      absentCount
      absentData {
        logID
        alertType
        workerShiftDate
        processName
        shiftName
        GID
        locName
        teamName
        displayName
        divName
        kakariDesc
        checkerWorkerA
        checkerWorkerB
        checkerWorkerC
        checkerWorkerD
        checkerWorkerE
        checkerWorkerF
        confirmWorker
        reasonDesc
        contactDesc
        confirmWorkerID
        reasonID
        iscontactID
        createdDate
        toShow
        shiftID
        empID
        confirm
      }
    }
  }
`;
