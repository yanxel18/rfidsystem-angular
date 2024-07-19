import gql from 'graphql-tag';

export const GET_ABSENTDROP_LIST = gql`
  query AbsentDropList {
    ReasonList {
      reasonID
      reasonDesc
    }
    ContactList {
      contactID
      contactDesc
    }
  }
`;

export const GET_APPROVER_LIST = gql`
  query ApproverList($approverName: String) {
    ApproverList(approverName: $approverName) {
      approverEmpID
      displayName
    }
  }
`;

export const UPDATE_ABSENT_WORKER = gql`
  mutation UpdateAbsentInfo(
    $logId: String!
    $approverEmpId: String
    $selectedEmpId: String!
    $reasonId: Float
    $contactId: Float
  ) {
    UpdateAbsentInfo(
      logID: $logId
      approverEmpID: $approverEmpId
      selectedEmpID: $selectedEmpId
      reasonID: $reasonId
      contactID: $contactId
    ) {
      status
    }
  }
`;
