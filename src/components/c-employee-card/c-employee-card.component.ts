import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IViewEmployeeBoard } from 'src/models/viewboard-model';

@Component({
  selector: 'app-c-employee-card',
  templateUrl: './c-employee-card.component.html',
  styleUrls: ['./c-employee-card.component.sass'],
})
export class CEmployeeCardComponent implements OnInit {
  @Input() empData!: IViewEmployeeBoard;
  @Output() nameoutput = new EventEmitter<string>();

 
   
  ngOnInit(): void{ 
  }

  statusColor(): string {
    switch (this.empData.statusID) {
      case 1:  return 'is-in';
      case 2: return 'is-out';
      case 3: return 'is-home';
      case 4: return 'is-leave'; 
      default: return ''
    }  
  }
}
