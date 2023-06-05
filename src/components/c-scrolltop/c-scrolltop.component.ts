import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { debounceTime, fromEvent, map, tap } from 'rxjs';
@Component({
  selector: 'app-c-scrolltop',
  templateUrl: './c-scrolltop.component.html',
  styleUrls: ['./c-scrolltop.component.sass'],
})
export class CScrolltopComponent {
  windowScrolled!: boolean;
  constructor(@Inject(DOCUMENT) private document: Document) {}
  @HostListener('window:scroll', [])
  showBtn$ = fromEvent(this.document, 'scroll').pipe(
    debounceTime(50),
    map(() => window.scrollY > 500),
    tap(() => console.log('sas'))
  );

  gotoTop() {
    console.log(this.showBtn$);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  onWindowScroll(): void {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }
  scrollToTop(): void {
    (function smoothscroll() {
      const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      console.log(currentScroll);
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
}
