import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { get, isEmpty, isEqual, omitBy } from 'lodash-es';
import {
  Subscription,
  merge,
  pairwise,
  debounceTime,
  scan,
  map,
  Subject,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-filter-by-column',
  templateUrl: './filter-by-column.component.html',
  styleUrls: ['./filter-by-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterByColumnComponent implements OnInit, OnDestroy {
  @Input() columnDefs: any[] = [];

  @Output() readonly changeFilter = new EventEmitter();

  readonly formFilters = this.fb.group({
    column: [],
    filter: [],
  });

  private cachedColumn: any = {};
  private readonly reset$ = new Subject();
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly fb: FormBuilder) {}

  get filterControl() {
    return this.formFilters.get('filter') as FormControl;
  }

  get columnControl() {
    return this.formFilters.get('column') as FormControl;
  }

  ngOnInit(): void {
    this.columnControl.setValue(get(this.columnDefs, '[0].def'), {
      emitEvent: false,
    });

    const filters$ = this.formFilters.valueChanges.pipe(
      debounceTime(150),
      pairwise(),
      map(([prev, curr]) => ({
        changeColumn: prev.column !== curr.column,
        ...curr,
      }))
    );

    const reset$ = this.reset$.pipe(
      tap({
        next: () => {
          this.changeFilter.emit((this.cachedColumn = {}));
        },
      }),
      map(() => ({ reset: true }))
    );

    this.subscriptions.push(
      merge(filters$, reset$)
        .pipe(
          scan((acc, { reset, changeColumn, ...curr }) => {
            if (reset) {
              return {};
            }

            if (changeColumn) {
              this.filterControl.setValue(
                this.cachedColumn[curr.column] ?? '',
                {
                  emitEvent: false,
                }
              );
            }

            return omitBy(
              { ...acc, [curr.column]: this.filterControl.value },
              isEmpty
            );
          }, {})
        )
        .subscribe((filters) => {
          if (!isEqual(this.cachedColumn, filters)) {
            this.changeFilter.emit(filters);
            this.cachedColumn = filters;
            console.log(
              '🚀 ~ file: filter-by-column.component.ts ~ line 73 ~ FilterByColumnComponent ~ .subscribe ~ this.cachedColumn',
              this.cachedColumn
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onReset(): void {
    this.formFilters.reset();

    this.columnControl.setValue(get(this.columnDefs, '[0].def'), {
      emitEvent: false,
    });

    this.reset$.next(undefined);
  }
}
