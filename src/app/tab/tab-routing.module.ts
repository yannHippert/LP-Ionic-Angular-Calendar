import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabPage,
    children: [
      {
        path: 'day',
        loadChildren: () =>
          import('@pages/day/day.module').then((m) => m.DayPageModule),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('@pages/event-list/event-list.module').then(
            (m) => m.EventListPageModule
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('@pages/month/month.module').then((m) => m.MonthPageModule),
      },
      {
        path: 'add',
        loadChildren: () =>
          import('@pages/event-add/event-add.module').then(
            (m) => m.EventAddPageModule
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@pages/event-edit/event-edit.module').then(
            (m) => m.EventEditPageModule
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/day',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
