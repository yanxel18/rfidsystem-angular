import { z } from 'zod';

export const ZTableTotal = z.array(
  z.object({
    workerInTotal: z.number(),
    workerAllTotal: z.number(),
    workerInPercent: z.number(),
    totalTeamName: z.string(),
  })
);
export const ZTableList = z.array(
  z.object({
    divID: z.number(),
    divName: z.string(),
    kakariID: z.number(),
    kakariDesc: z.string(),
    koutaiInCount: z.number(),
    koutaiTotalCount: z.number(),
    koutaiPercent: z.number(),
    dayShiftInCount: z.number(),
    dayShiftTotalCount: z.number(),
    dayShiftPercent: z.number(),
    normalShiftInCount: z.number(),
    normalShiftTotalCount: z.number(),
    normalShiftPercent: z.number(),
  })
);
export const ZAttendanceView = z.object({
  TableTotal: ZTableTotal.default([]),
  TableList: ZTableList.default([]),
});

export type IAttendanceView = z.infer<typeof ZAttendanceView>;
export type ITableList = z.infer<typeof ZTableList>;
export type ITableTotal = z.infer<typeof ZTableTotal>;
