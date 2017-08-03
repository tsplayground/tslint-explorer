import {
  Directive,
  ElementRef,
  HostListener,
  Input
} from '@angular/core';

@Directive({
  selector: '[sticky]'
})
export class StickyDirective {
  private minY = 100;
  private className = 'sticky';
  @Input('stickyMin') set stickyMin(minY: number) {
    this.minY = minY || this.minY;
  }
  @Input('stickyClass') set stickyClass(className: string) {
    this.className = className || this.className;
  }
  constructor(
    private element: ElementRef) { }

  @HostListener('window:scroll', ['$event'])
  public handleScrollEvent(e): void {

    if (window.pageYOffset > this.minY) {
      this.element.nativeElement.classList.add(this.className);
    } else {
      this.element.nativeElement.classList.remove(this.className);
    }
  }
}