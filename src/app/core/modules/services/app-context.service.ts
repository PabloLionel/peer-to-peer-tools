import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { distinctUntilChanged, debounceTime, map, Observable } from 'rxjs';

const S = '(max-width: 640px)';
const M = '(min-width: 641px) and (max-width: 1024px)';
const LG = '(min-width: 1025px) and (max-width: 1440px)';
const XL = '(min-width: 1441px)';
export interface IBreakpoint {
  breakpoint: 's' | 'm' | 'lg' | 'xl';
  orientation: 'landscape' | 'portrait';
  orientationDegrees?: number;
  media: 'web' | 'mobile' | 'tablet';
}

@Injectable({
  providedIn: 'root',
})
export class AppContextService {
  // s  : 0,     Todos los tamaños
  // m  : 40em,  ~ 640px
  // lg : 64em,  ~ 1024px
  // xl : 90em   ~1440px
  public readonly breakpoint$!: Observable<IBreakpoint>;

  constructor(public readonly breakpointObserver: BreakpointObserver) {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        S,
        M,
        LG,
        XL,
        '(orientation: portrait)',
        '(orientation: landscape)',
        Breakpoints.Handset,
        Breakpoints.Tablet,
        Breakpoints.Web,
      ])
      .pipe(
        distinctUntilChanged(),
        debounceTime(100),
        map(({ breakpoints }: BreakpointState) => {
          const state: IBreakpoint = {
            breakpoint: 's',
            orientation: 'landscape',
            orientationDegrees: window.orientation,
            media: 'web',
          };

          if (breakpoints[M]) {
            state.breakpoint = 'm';
          } else if (breakpoints[LG]) {
            state.breakpoint = 'lg';
          } else if (breakpoints[XL]) {
            state.breakpoint = 'xl';
          }

          if (breakpoints['(orientation: portrait)']) {
            state.orientation = 'portrait';
          }

          if (breakpoints[Breakpoints.Handset]) {
            state.media = 'mobile';
          } else if (breakpoints[Breakpoints.Tablet]) {
            state.media = 'tablet';
          }

          return state;
        })
      );
  }
}
