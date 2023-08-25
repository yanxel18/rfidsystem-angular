/**
 * Model viewEmployeeBoard
 */
export interface IViewEmployeeBoard {
  empID: string | null;
  tagID: string | null;
  lastUpdate: string | null;
  timeElapse: string | null;
  displayName: string | null;
  statusID: number | null;
  sign: string | null;
  readwriterID: number | null;
  comment: string | null;
  areaID: number | null;
  areaDesc: string | null;
  alarm: boolean | null;
  setAlarm: boolean | null;
  setCount: boolean | null;
  locID: number | null;
  locDesc: string | null;
  floor: string | null;
  buildloc: string | null;
  empProcessID: number | null;
  processName: string | null;
  teamID: number | null;
  teamName: string | null;
  leaveStart: Date | null;
  leaveEnd: Date | null;
  leaveType: number | null;
  empLoc: number | null;
  empArea: number | null;
}
export interface EmployeeBoardWithRatio {
  EmployeeBoardAll: {
    EmployeeBoardAllSub: IViewEmployeeBoard[];
    AreaRatio?: IEmployeeCountRatio;
  };
}
export interface IEmployeeBoardView {
  EmployeeBoardAll: EmployeeBoardWithRatio;
}
export interface IEmployeeCountRatio {
  currentPercent?: string | null;
  currentWorkerCount?: number | null;
  totalWorkerCount?: number | null;
}
export interface IViewEmployedeBoardRes {
  EmployeeBoardAllSub: IViewEmployeeBoard[];
}
export interface IEmployeeBoardArgs {
  search: string | null;
  areaID: number | null;
  teamID: number | null;
  locID: number | null;
  posID: number | null;
  divID: number | null;
  pageoffset: number | null;
  pagenum: number | null;
  order: number | null;
}

export interface IPageValues {
  pageSize: number;
  pageIndex: number;
}

export interface IResponseGetEmpCount {
  EmpCount: number | null;
}

export interface IAreaList {
  areaID: number;
  areaDesc: string;
}

export interface ILocationList {
  locID: number;
  buildloc: string;
}

export interface ITeamList {
  teamID: number;
  teamName: string;
}
export interface IPositionList {
  posID: number;
  posName: string;
}
export interface IDivisionList {
  divID: number;
  divName: string;
}
export interface IViewDropList {
  ViewDropList: {
    IAreaList: IAreaList[];
    ILocationList: ILocationList[];
    ITeamList: ITeamList[];
    IPositionList: IPositionList[] | [];
    IDivisionList: IDivisionList[] | [];
  };
}

export interface IFilteredCountRes {
  EmpBoardMaxCountFilter: number;
}

export interface IPerAreaGraph {
  x: string;
  y: number;
}

export interface IPerAreaGraphResponse {
  PerAreaGraph: IPerAreaGraph[];
}

export interface ITotalArea {
  areaName: string;
  total: number;
  percent: number;
  workerIn: number;
}

export interface IPerArea {
  area: string;
  bldg: string;
  workerIn: number;
  workerInTotal: number;
  percent: number;
}

export interface IPerAreaTotalStatistics {
  PerArea: IPerArea[];
  TotalArea: ITotalArea[];
}

export interface ISkeletonLoader {
  'background-color'?: string;
  height?: string;
  'border-radius'?: string;
  width?: string;
  margin?: string;
}

export interface IDateSelect {
  workDate: string;
}

export interface IDateSelectRes {
  DateList: IDateSelect[] | [];
}

export interface IFormValues {
  date: string;
  time: string;
  datetime: string;
}

export interface IDefaultStoreValue {
  getPageView: string | null;
  getpagenum: string | null;
  getArea: string | null;
  getAreaText: string | null;
  getTeam: string | null;
  getLoc: string | null;
  getPos: string | null;
  getViewBoard: string | null;
  getDivision: string | null;
  getSort: string | null;
}