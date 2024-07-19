import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CSetabsentDialogService } from './c-setabsent-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ISelectedAbsentWorker } from 'src/models/dialog-model';
import {
  IApproverData,
  IContactList,
  IReasonList,
  IUpdateAbsetInfoArgs,
} from './c-setabsent-dialog-interface';
import { map, Observable, of, startWith, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toHalfwidthKana } from 'japanese-string-utils';
@Component({
  selector: 'app-c-setabsent-dialog',
  templateUrl: './c-setabsent-dialog.component.html',
  styleUrls: ['./c-setabsent-dialog.component.sass'],
  providers: [CSetabsentDialogService],
})
export class CSetabsentDialogComponent implements OnInit, OnDestroy {
  absentForm!: FormGroup;

  constructor(
    private cSetabsentDialogService: CSetabsentDialogService,
    private dialogRef: MatDialogRef<CSetabsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public receivedData: ISelectedAbsentWorker,
    private _snackBar: MatSnackBar
  ) {
    this.absentForm = new FormGroup({
      approverName: new FormControl<string | null | undefined>(
        typeof this.receivedData?.approverName === 'string'
          ? this.defaultApproverList.find(
              (x) => x === this.receivedData?.approverName
            )
            ? this.receivedData?.approverName
            : 'その他'
          : '',
        Validators.required
      ),
      reasonID: new FormControl<number | null>(
        receivedData?.reasonID ?? null,
        Validators.required
      ),
      contactID: new FormControl<number | null>(
        receivedData?.contactID ?? null,
        Validators.required
      ),
      otherApproverName: new FormControl<string | null | undefined>(
        this.defaultApproverList.find(
          (x) => x === this.receivedData?.approverName
        )
          ? null
          : this.receivedData?.approverName
      ),
    });
  }
  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['snackbar-white'],
    });
  }
  contactList$!: Observable<IContactList[]>;
  reasonList$!: Observable<IReasonList[]>;
  approverNamesList: IApproverData[] = [];

  defaultApproverList: string[] = this.receivedData.approverList
    .map((approverName) => {
      return typeof approverName === 'string' ? approverName : '';
    })
    .concat('その他');

  excludedDefaultApproverList: IApproverData[] = [];

  approverListOptions$: Observable<string[]> = of(this.defaultApproverList);
  approverAllListOptions$!: Observable<string[]>;
  subscription: Subscription[] = [];
  ngOnInit(): void {
    this.contactList$ = this.cSetabsentDialogService
      .getAbsentDropList()
      .pipe(map(({ data }) => data.ContactList));

    this.reasonList$ = this.cSetabsentDialogService
      .getAbsentDropList()
      .pipe(map(({ data }) => data.ReasonList));

    this.subscription.push(
      this.cSetabsentDialogService
        .getApproverList(null)
        .subscribe(({ data }) => {
          if (data.ApproverList.length > 0) {
            this.approverNamesList = data.ApproverList;
            this.excludedDefaultApproverList = this.approverNamesList
              .filter(
                (y) =>
                  !this.defaultApproverList.some((x) => x === y.displayName)
              )
              .filter((d) => d.displayName !== this.receivedData?.displayName);
          }
        })
    );

    this.approverAllListOptions$ =
      this.absentForm.get('otherApproverName')?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterNames(value || ''))
      ) ?? of([]);
  }

  selectedApproverNameOnChange(): void {
    const selectedOtherApprover = this.absentForm.controls['otherApproverName'];
    const selectedApprover = this.absentForm.controls['approverName'];
    if (selectedApprover.value === 'その他') {
      selectedOtherApprover.setValidators([Validators.required]);
      selectedOtherApprover.updateValueAndValidity();
    } else {
      selectedOtherApprover.setValue('');
      selectedOtherApprover.clearValidators();
      selectedOtherApprover.updateValueAndValidity();
    }
  }
  private _filterNames(value: string): string[] {
    const filterValue = toHalfwidthKana(value?.toLowerCase() || '');
    return this.excludedDefaultApproverList
      .filter((name) => name.displayName.includes(filterValue))
      .map((name) => name.displayName)
      .slice(0, 10);
  }

  displayFn(approverName: string | null): string {
    return approverName ?? '';
  }
  approverNameError(): string | null {
    if (this.absentForm.get('approverName')?.hasError('required')) {
      return '確認対応者は必須です。';
    }
    return null;
  }
  otherApproverNameError(): string | null {
    if (this.absentForm.get('otherApproverName')?.hasError('required')) {
      return '「その他」確認対応者は必須です。';
    }
    return null;
  }

  reasonError(): string | null {
    if (this.absentForm.get('reasonID')?.hasError('required')) {
      return '選択式に選んでください。';
    }
    return null;
  }

  contactError(): string | null {
    if (this.absentForm.get('contactID')?.hasError('required')) {
      return '選択式に選んでください。';
    }
    return null;
  }

  updateInfo(): void {
    const { approverName, otherApproverName, reasonID, contactID } = this
      .absentForm.value as IUpdateAbsetInfoArgs;
    const selectedApprover = this.approverNamesList.find(
      (x) =>
        x.displayName === approverName &&
        this.receivedData?.approverList?.includes(x.displayName)
    );
    const selectedOtherApprover = this.approverNamesList.find(
      (x) =>
        x.displayName === otherApproverName &&
        !this.receivedData?.approverList?.includes(x.displayName)
    );

    if (!selectedApprover && !selectedOtherApprover) {
      this.openSnackBar('「その他」確認者を確認してください。', 'はい');
      return;
    }

    if (this.absentForm.valid) {
      const updateValue: IUpdateAbsetInfoArgs = {
        logID: this.receivedData?.logID,
        approverEmpID:
          selectedApprover?.approverEmpID ??
          selectedOtherApprover?.approverEmpID,
        selectedEmpID: this.receivedData?.selectedEmpID,
        reasonID,
        contactID,
      };

      this.cSetabsentDialogService
        .updateAbsentWorker(updateValue)
        .subscribe(({ data }) => {
          if (data?.UpdateAbsentInfo.status === 'success') {
            this.openSnackBar('更新しました。', 'はい');
            this.closeDialog();
          }
        });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.subscription.forEach((s) => s.unsubscribe());
  }
}
