import { Component, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { INewComment, ISelectedWorkerComment } from "src/models/dialog-model";
import { IViewEmployeeBoard } from "src/models/viewboard-model";
import { CDialogCommentService } from "./c-dialog-comment.service";
import { Subscription } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-c-dialog-comment",
  templateUrl: "./c-dialog-comment.component.html",
  styleUrls: ["./c-dialog-comment.component.sass"],
  providers: [CDialogCommentService],
})
export class CDialogCommentComponent implements OnDestroy {
  Subscriptions: Subscription[] = [];
  commentFormGroup!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CDialogCommentComponent>,
    private cDialogCommentService: CDialogCommentService,
    @Inject(MAT_DIALOG_DATA) public receivedData: IViewEmployeeBoard
  ) {
    this.commentFormGroup = new FormGroup({
      comment: new FormControl<string | null>(this.receivedData.comment),
    });
  }
  updateComment(): void {
    this.Subscriptions.forEach((s) => s.unsubscribe());
    const val: INewComment = this.commentFormGroup.value;
    if (typeof this.receivedData.empID === "string") {
      const newData: ISelectedWorkerComment = {
        empID: this.receivedData.empID,
        comment: val.comment,
      };
      this.Subscriptions.push(
        this.cDialogCommentService
          .updateComment(newData)
          .subscribe(({ data }) => {
            if (data) {
              if (typeof data.UpdateEmployeeComment.status === "string") {
                this.closeDialog();
              }
            }
          })
      );
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.Subscriptions.forEach((s) => s.unsubscribe());
  }
}
