import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BashboardComponent } from './bashboard.component';

const routes: Routes = [{ path: '', component: BashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BashboardRoutingModule { }
