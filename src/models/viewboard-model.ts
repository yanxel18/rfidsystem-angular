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
  currentWorkerLessAwol?: number | null;
  currentPercentWithAwol?: string | null;
  totalWorkerCount?: number | null;
}
export interface IViewEmployedeBoardRes {
  EmployeeBoardAllSub: IViewEmployeeBoard[];
}

export interface IEmployeeBoardArgs extends PageFilters {
  areaID?: number[] | null;
  teamID?: number[] | null;
  locID?: number[] | null;
  posID?: number[] | null;
  divID?: number[] | null;
  search?: string | null;
  kakariID?: number[] | null;
  order?: number | null;
}

export interface PageFilters {
  pageoffset: number;
  pagenum: number;
}
export interface IPageValues {
  pageSize: number;
  pageIndex: number;
}

export interface KetsuPageValues {
  getCurrentPageCount: string | null;
  getCurrentPageNum: string | null;
  getPrevPageCount: string | null;
  getPrevPageNum: string | null;
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
export interface IKakariList {
  kakariID: number;
  kakariDesc: string;
}
export interface IViewDropList {
  ViewDropList: {
    IAreaList: IAreaList[];
    ILocationList: ILocationList[];
    ITeamList: ITeamList[];
    IPositionList: IPositionList[] | [];
    IDivisionList: IDivisionList[] | [];
    IKakariList: IKakariList[] | [];
  };
}

export interface IFilteredCountRes {
  EmpBoardMaxCountFilter: number;
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

export interface IFilterDefaultTypes {
  areaID?: number[];
  locID?: number[];
  teamID?: number[];
  posID?: number[];
  divID?: number[];
  kakariID?: number[];
}
export interface IDefaultStoreValue {
  getPageView: string | null;
  getpagenum: string | null;
  getAreaText: string | null;
  getViewBoard: string | null;
  getSort: string | null;
  getDefaultFilter: string | null;
}
