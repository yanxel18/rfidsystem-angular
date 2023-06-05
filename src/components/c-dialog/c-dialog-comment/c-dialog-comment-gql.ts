import gql from "graphql-tag";
export const UPDATE_COMMENT = gql`
  mutation UpdateEmployeeComment($empId: String!, $comment: String) {
    UpdateEmployeeComment(empID: $empId, comment: $comment) {
      status
    }
  }
`;
