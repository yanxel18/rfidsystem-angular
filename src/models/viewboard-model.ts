/**
 * Model viewEmployeeBoard
 */
export interface IViewEmployeeBoard {
    empID: string | null  
    tagID: string | null  
    lastUpdate: string | null  
    timeElapse: string | null
    displayName: string | null
    statusID: number | null
    sign: string | null
    readwriterID: number | null
    comment: string | null
    areaID: number | null
    areaDesc: string | null
    alarm: boolean | null
    setAlarm: boolean | null
    setCount: boolean | null
    locID: number | null
    locDesc: string | null
    floor: string | null
    buildloc: string | null
    empProcessID: number | null
    processName: string | null
    teamID: number | null
    teamName: string | null
    leaveStart: Date | null
    leaveEnd: Date | null
    leaveType: number | null 
  }

  export interface IViewEmployeeBoardRes { 
    EmployeeBoardAll: IViewEmployeeBoard [] 
  }
  export interface IEmployeeBoardArgs {
    areaID?: number | null
    teamID?: number | null
    locID?: number | null
    pageoffset?: number | null
    pagenum?: number | null
  }

  export interface IPageValues {
    pageSize: number,
    pageIndex: number
  }

  export interface IResponseGetEmpCount{
    EmpCount: number | null
  }