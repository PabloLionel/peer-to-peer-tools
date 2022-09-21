/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { get } from 'lodash-es';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { AppContextService } from '../services';

export enum FilterType {
  byColumn = 'byColumn',
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  @Output()
  add: EventEmitter<any> = new EventEmitter();
  @Output()
  selectedMenu: EventEmitter<any> = new EventEmitter();

  @Input() detailExpandRef!: TemplateRef<any>;

  contextMenuPosition = { x: '0px', y: '0px' };
  selection = new SelectionModel<any>(true, []);
  expandedElement: any | null;
  breakpoint!: any;
  _config: any = {};
  _FILTER_TYPE: typeof FilterType = FilterType;

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly appContextService: AppContextService
  ) {}

  get menuItems(): any[] {
    return get(this, '_config.menu.items', []);
  }

  @Input() set config(config: any) {
    if (Array.isArray(config.dataSource)) {
      this._config.dataSource = new MatTableDataSource(config.dataSource);
    } else if (!config.dataSource) {
      this._config.dataSource = new MatTableDataSource([]);
    } else {
      this._config.dataSource = config.dataSource;
    }

    this._config.columnDefs = config.columnDefs ?? [];
    this._config.checkable = config.checkable ?? false;
    this._config.filterType = config.filterType;
    this._config.menu = config.menu;

    this._config.displayedColumns = Array.isArray(config.displayedColumns)
      ? config.displayedColumns
      : config.columnDefs.map(({ def }: any) => def);

    this._config.columnsToDisplayWithExpand = this._config.displayedColumns;

    if (this._config.checkable) {
      this._config.displayedColumns.unshift('select');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.subscriptions.push(
        this.appContextService.breakpoint$.subscribe(({ breakpoint }) => {
          this.breakpoint = breakpoint;

          this.cd.markForCheck();
        })
      );

      this._config.dataSource.paginator = this.paginator;
      this._config.dataSource.sort = this.sort;

      if (this._config.filterType === FilterType.byColumn) {
        this._config.dataSource.filterPredicate = (row: any, _filter: any) => {
          const filters = JSON.parse(_filter);

          if (filters.length === 0) {
            return true;
          }

          const matches = filters.map(([column, filter]: any) =>
            new RegExp(filter, 'i').test(row[column])
          );

          return matches.every((isMatch: boolean) => isMatch);
        };
      }

      if (this.detailExpandRef) {
        this._config.columnsToDisplayWithExpand = [
          ...this._config.displayedColumns,
          'expand',
        ];
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // #region filter
  applyFilter(filterValue: any): any {
    if (this._config.filterType === FilterType.byColumn) {
      const jsonString = JSON.stringify(Object.entries(filterValue));

      return (this._config.dataSource.filter = jsonString);
    }

    this._config.dataSource.filter = get(filterValue, 'target.value', '')
      .trim()
      .toLowerCase();
  }
  // Called on Filter change
  filterChange(event: any) {}
  // #endregion

  // #region checkable
  /**
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this._config.dataSource.data.length;

    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    if (this.isAllSelected()) {
      return this.selection.clear();
    }

    this.selection.select(...this._config.dataSource.data);
  }

  /**
   * The label for the checkbox on the passed row
   */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  // #endregion

  // #region on
  onClick(row: any) {
    this.cd.markForCheck();
  }

  onContextMenuAction(menu: any, row: any) {
    this.selectedMenu.emit({ menu, row });
  }

  _onContextMenu(event: MouseEvent, { row }: any) {
    event.preventDefault();

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    this.contextMenu.menuData = { row };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  // #endregion
}
