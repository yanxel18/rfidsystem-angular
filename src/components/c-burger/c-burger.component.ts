import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-c-burger',
  templateUrl: './c-burger.component.html',
  styleUrls: ['./c-burger.component.sass']
})
export class CBurgerComponent {
  @Input() init: boolean | undefined;
  @Output() opened = new EventEmitter<any>();

  active = false;

  ngOnInit() {
    this.active = this.init || false;
  }

  onBurgerClicked() {
    this.active = !this.active;
    this.opened.emit();
  }
}
