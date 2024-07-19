import { z } from 'zod';

export const ZKetsuRow = z.object({
  logID: z.string(),
  alertType: z.string().nullable(),
  workerShiftDate: z.string().nullable(),
  processName: z.string().nullable(),
  shiftName: z.string().nullable(),
  GID: z.string().nullable(),
  locName: z.string().nullable(),
  teamName: z.string().nullable(),
  displayName: z.string().nullable(),
  checkerWorkerA: z.string().nullable(),
  checkerWorkerB: z.string().nullable(),
  checkerWorkerC: z.string().nullable(),
  checkerWorkerD: z.string().nullable(),
  checkerWorkerE: z.string().nullable(),
  confirmWorker: z.string().nullable(),
  reasonDesc: z.string().nullable(),
  contactDesc: z.string().nullable(),
  confirmWorkerID: z.string().nullable(),
  reasonID: z.number().nullable(),
  iscontactID: z.number().nullable(),
  createdDate: z.string().nullable(),
  toShow: z.boolean().nullable(),
  empID: z.string().nullable(),
  confirm: z.boolean().nullable(),
});
export const ZKetsuArray = z.array(ZKetsuRow);

export type IKetsuArray = z.infer<typeof ZKetsuArray>;
export type IKetsuTable = z.infer<typeof ZKetsuData>;

export type IKetsuRow = z.infer<typeof ZKetsuRow>;
export const ZKetsuData = z.object({
  absentData: ZKetsuArray,
  absentCount: z.number().nullable(),
});
export type IKetsuData = z.infer<typeof ZKetsuData>;
export const ZKetsuArgs = z.object({
  toShow: z.boolean(),
  skip: z.number().optional(),
  take: z.number().optional(),
});

export type IKetsuArgs = z.infer<typeof ZKetsuArgs>;

export const ZKetsuReturn = z.object({
  KetsuTable: ZKetsuData,
});

export type IKetsuReturn = z.infer<typeof ZKetsuReturn>;
