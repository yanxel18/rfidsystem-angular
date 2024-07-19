export interface ISelectedWorkerComment {
  empID: string;
  comment?: string | null;
}

export interface ISelectedWorkerResponse {
  UpdateEmployeeComment: {
    status: string;
  };
}
export interface INewComment {
  comment: string;
}

export interface IDialog {
  minWidth: string;
  maxWidth: string;
}

export interface ISelectedAbsentWorker {
  logID?: string | null;
  selectedEmpID?: string | null;
  approverEmpID?: string | null;
  reasonID?: number | null;
  contactID?: number | null;
  displayName?: string | null;
  approverName?: string | null;
  otherApproverName?: string | null;
  approverList: (string | number | boolean | null)[];
}

export interface IAbsentWorkerResponse {
  UpdateAbsentInfo: {
    status: string;
  };
}
