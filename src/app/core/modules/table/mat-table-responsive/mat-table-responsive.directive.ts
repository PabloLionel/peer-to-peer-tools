import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[matTableResponsive]',
})
export class MatTableResponsiveDirective
  implements OnInit, AfterViewInit, OnDestroy
{

  private thead!: HTMLTableSectionElement;
  private tbody!: HTMLTableSectionElement;

  private readonly theadChanged$ = new BehaviorSubject(true);
  private readonly tbodyChanged$ = new Subject<boolean>();
  private readonly onDestroy$ = new Subject<boolean>();

  private readonly theadObserver = new MutationObserver(() =>
    this.theadChanged$.next(true)
  );
  private readonly tbodyObserver = new MutationObserver(() =>
    this.tbodyChanged$.next(true)
  );

  constructor(
    private readonly table: ElementRef,
    private readonly renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.thead = this.table.nativeElement.querySelector('thead');
    this.tbody = this.table.nativeElement.querySelector('tbody');

    this.theadObserver.observe(this.thead, {
      characterData: true,
      subtree: true,
    });

    this.tbodyObserver.observe(this.tbody, { childList: true });
  }

  ngAfterViewInit() {
    /**
     * Set the "data-column-name" attribute for every body row cell, either on
     * thead row changes (e.g. language changes) or tbody rows changes (add, delete).
     */
    combineLatest([this.theadChanged$, this.tbodyChanged$])
      .pipe(
        map(() => ({
          headRow: this.thead.rows.item(0),
          bodyRows: this.tbody.rows,
        })),
        map(({ headRow, bodyRows }: any) => ({
          columnNames: Array.from(headRow.children).map(
            ({ textContent }: any) => textContent
          ),
          rows: Array.from(bodyRows).map((row: any) => Array.from(row.children)),
        })),
        takeUntil(this.onDestroy$)
      )
      .subscribe(({ columnNames, rows }) =>
        rows.forEach((rowCells) =>
          rowCells.forEach((cell) =>
            this.renderer.setAttribute(
              cell,
              'data-column-name',
              columnNames[(cell as HTMLTableCellElement).cellIndex]
            )
          )
        )
      );
  }

  ngOnDestroy(): void {
    this.theadObserver.disconnect();
    this.tbodyObserver.disconnect();

    this.onDestroy$.next(true);
  }
}
