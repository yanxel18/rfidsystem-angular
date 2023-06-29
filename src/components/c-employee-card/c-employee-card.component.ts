import { Component, Input } from "@angular/core";
import { IViewEmployeeBoard } from "src/models/viewboard-model";
import { StatusStyle } from "src/models/enum";
import { MatDialog } from "@angular/material/dialog";
import { CDialogCommentComponent } from "../c-dialog/c-dialog-comment/c-dialog-comment.component";
import { ICommentDialog } from "src/models/dialog-model";
@Component({
  selector: "app-c-employee-card",
  templateUrl: "./c-employee-card.component.html",
  styleUrls: ["./c-employee-card.component.sass"],
})
export class CEmployeeCardComponent {
  @Input() empData!: IViewEmployeeBoard;
  constructor(private commentDialogBox: MatDialog) {}
  readonly commentDialog: ICommentDialog = {
    minWidth: "320px",
    maxWidth: "825px",
  };
  /**
   *
   * @returns progress spinner value
   */
  progressValue(): number {
    const HOURMIN = 60;
    const MAXSPINNERVAL = 100;
    const elapseTimeHour: number =
      typeof this.empData.timeElapse === "string"
        ? +this.empData.timeElapse.slice(0, 2)
        : 0;
    const elapseTimeMinute: number =
      typeof this.empData.timeElapse === "string"
        ? +this.empData.timeElapse.slice(3, 5)
        : 0;
    const computeTime = parseFloat(
      ((elapseTimeMinute / HOURMIN) * MAXSPINNERVAL).toFixed(2)
    );

    if (this.empData.statusID === 1) return 0;
    else if (elapseTimeHour === 0) return computeTime;
    else if (elapseTimeHour > 0) return MAXSPINNERVAL;
    else return 0;
  }

  openCommentBox(): void {
    this.commentDialogBox.open(CDialogCommentComponent, {
      disableClose: false,
      minWidth: this.commentDialog.minWidth,
      data: this.empData,
    });
  }
  /**
   *
   * @param comments
   * @returns new  short comment with 7 characters
   */
  shortComment(comments: string | null): string | null {
    if (typeof comments === "string")
      if (comments.length > 7) return ` ${comments.substring(0, 7)}...`;
    return comments || null;
  }
  /**
   *
   * @returns CSS or null
   */
  statusColor(): string {
    switch (this.empData.statusID) {
      case 1:
        return StatusStyle.IS_IN;
      case 2:
        return StatusStyle.IS_OUT;
      case 3:
        return StatusStyle.IS_HOME;
      case 4:
        return StatusStyle.IS_LEAVE;
      case 5:
        return StatusStyle.IS_KETSU;
      default:
        return "";
    }
  }
  /**
   *
   * @returns CSS red for exceeding 1hour or blue for less than 1 hour
   */
  spinnerColor(): string {
    return this.empData.setAlarm ? "card-spinner-red" : "card-spinner-blue";
  }
}
