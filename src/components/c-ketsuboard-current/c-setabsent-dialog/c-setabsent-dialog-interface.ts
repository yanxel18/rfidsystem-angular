import { z } from 'zod';
export const ZReasonList = z.object({
  reasonID: z.number().nullable(),
  reasonDesc: z.string().nullable(),
});

export const ZContactList = z.object({
  contactID: z.number().nullable(),
  contactDesc: z.string().nullable(),
});

export type IReasonList = z.infer<typeof ZReasonList>;
export type IContactList = z.infer<typeof ZContactList>;

export const ZAbsentDropList = z.object({
  ReasonList: z.array(ZReasonList).default([]),
  ContactList: z.array(ZContactList).default([]),
});

export type IAbsentDropList = z.infer<typeof ZAbsentDropList>;

export const ZApproverData = z.object({
  approverEmpID: z.string(),
  displayName: z.string(),
});

export type IApproverData = z.infer<typeof ZApproverData>;

export const ZApproverList = z.object({
  ApproverList: z.array(ZApproverData).default([]),
});

export type IApproverList = z.infer<typeof ZApproverList>;

export const ZUpdateAbsentInfo = z.object({
  logID: z.string().nullable().optional(),
  approverEmpID: z.string().nullable().optional(),
  approverName: z.string().nullable().optional(),
  selectedEmpID: z.string().nullable().optional(),
  reasonID: z.number().nullable().optional(),
  contactID: z.number().nullable().optional(),
  otherApproverName: z.string().nullable().optional(),
});

export type IUpdateAbsetInfoArgs = z.infer<typeof ZUpdateAbsentInfo>;

export const ZDownloadKetsuLogs = z.object({
  DownloadKetsuLogs: z.string().nullable(),
});

export type IDownloadKetsuLogs = z.infer<typeof ZDownloadKetsuLogs>;
