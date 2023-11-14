import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-c-burger',
  templateUrl: './c-burger.component.html',
  styleUrls: ['./c-burger.component.sass'],
})
export class CBurgerComponent implements OnInit {
  @Input() init: boolean | undefined;
  @Output() opened = new EventEmitter<boolean>();

  public active = false;

  ngOnInit() {
    this.active = this.init ?? false;
  }

  public onBurgerClicked() {
    this.active = !this.active;
    this.opened.emit();
  }
}
