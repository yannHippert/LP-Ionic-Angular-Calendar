import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DayPage } from './day.page';

const routes: Routes = [
  {
    path: '',
    component: DayPage,
  },
  {
    path: ':date',
    component: DayPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayPageRoutingModule {}
