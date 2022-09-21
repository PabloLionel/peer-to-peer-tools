import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BashboardRoutingModule } from './bashboard-routing.module';
import { BashboardComponent } from './bashboard.component';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [
    BashboardComponent
  ],
  imports: [
    CommonModule,
    BashboardRoutingModule,
    CoreModule,
  ]
})
export class BashboardModule { }
