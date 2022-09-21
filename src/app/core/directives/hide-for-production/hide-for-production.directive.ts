import { Directive, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment'

@Directive({
  selector: '[hideForProduction]'
})
export class HideForProductionDirective implements OnInit {

  constructor(private readonly elementRef: ElementRef) { }

  ngOnInit() {
    if (environment.production) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }

}
