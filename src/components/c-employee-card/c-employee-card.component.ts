import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { IViewEmployeeBoard } from 'src/models/viewboard-model';
import { StatusStyle } from 'src/models/enum';

@Component({
  selector: 'app-c-employee-card',
  templateUrl: './c-employee-card.component.html',
  styleUrls: ['./c-employee-card.component.sass'],
})
export class CEmployeeCardComponent implements OnInit {
  @Input() empData!: IViewEmployeeBoard;
  @Input() divCount!: number;
  @Input() rowCount!: number; 
  @Output() nameoutput = new EventEmitter<string>();
 
  ngOnInit(): void { }

  progressValue(): number {
    const HOUR: number = 60;
    const MAXSPINNERVAL: number = 100;
    const elapseTimeHour: number = this.empData.timeElapse
      ? parseInt(this.empData.timeElapse.slice(0, 2))
      : 0;
    const elapseTimeMinute: number = this.empData.timeElapse
      ? parseInt(this.empData.timeElapse.slice(3, 5))
      : 0;
    const computeTime = parseFloat(
      ((elapseTimeMinute / HOUR) * MAXSPINNERVAL).toFixed(2)
    );
      
    if (this.empData.statusID === 1) return 0;
    else if (elapseTimeHour === 0) return computeTime;
    else if (elapseTimeHour > 0) return MAXSPINNERVAL;
    else return 0;
  }
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
      default:
        return '';
    }
  }

  spinnerColor(): string { 
    return this.empData.setAlarm ? 'card-spinner-red' : 'card-spinner-blue';
  }

}
