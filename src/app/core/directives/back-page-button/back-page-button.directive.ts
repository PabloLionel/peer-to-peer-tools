import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[backPageButton]'
})
export class BackPageButtonDirective {
  constructor(private readonly location: Location) { }

  @HostListener('click')
  onClick() {
      this.location.back();
  }
}
