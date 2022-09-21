import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableResponsiveDirective } from './mat-table-responsive/mat-table-responsive.directive';
import { TableComponent } from './table.component';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { FilterByColumnComponent } from './filters/filter-by-column/filter-by-column.component';
import { DefValuePipe } from './pipes/defvalue/defvalue.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TableComponent,
    MatTableResponsiveDirective,
    FilterByColumnComponent,
    DefValuePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  exports: [TableComponent],
})
export class TableModule {}
