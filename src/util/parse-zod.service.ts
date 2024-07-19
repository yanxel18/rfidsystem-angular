import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import type { MonoTypeOperatorFunction } from 'rxjs';
import { MsgServiceService } from 'src/handlers/msg-service.service';
import type { SafeParseReturnType, ZodType } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class ParseZodService {
  constructor(private msgHandler: MsgServiceService) {}

  public parseResponse<T>(
    zodType: ZodType,
    errorMsg: string,
    source: string
  ): MonoTypeOperatorFunction<T> {
    return tap({
      next: (value: any) => {
        const dataValidate: SafeParseReturnType<any, any> = zodType.safeParse(
          value.data
        );
        if (!dataValidate.success)
          this.msgHandler.ErrorMsg(`${errorMsg} ${source}`);
      },
    });
  }
}
