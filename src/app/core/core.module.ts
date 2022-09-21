import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { customPaginator } from './modules/table/CustomPaginatorConfiguration';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MyDateAdapter, MY_DATE_FORMATS } from './utils';
import { TableModule, ModalModule, MaterialModule } from './modules';
import { ReactiveFormsModule } from '@angular/forms';
import { BackPageButtonDirective, HideForProductionDirective } from './directives';
import { ApplyFnPipe, DefvaluePipe } from './pipes';

const MODULES = [
  CommonModule,
  ReactiveFormsModule,
  TableModule,
  ModalModule,
  MaterialModule,
];

@NgModule({
  declarations: [
    BackPageButtonDirective,
    HideForProductionDirective,
    DefvaluePipe,
    ApplyFnPipe,
  ],
  imports: MODULES,
  providers: [
    { provide: MatPaginatorIntl, useValue: customPaginator() },
    {
      provide: DateAdapter,
      useClass: MyDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS,
    },
  ],
  exports: MODULES,
})
export class CoreModule {}
