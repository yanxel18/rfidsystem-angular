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