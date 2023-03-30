export interface ISelectedWorkerComment {
    empID: string,
    comment?: string | null
}

export interface ISelectedWorkerResponse {
    UpdateEmployeeComment: {
        status: string
    }
    
}
export interface INewComment  {
    comment: string
  }

export interface ICommentDialog {
    minWidth: string,
    maxWidth: string
}