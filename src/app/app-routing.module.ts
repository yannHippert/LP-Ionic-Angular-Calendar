import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tab/tab.module').then((m) => m.TabPageModule),
  },
  {
    path: 'day',
    loadChildren: () =>
      import('./pages/day/day.module').then((m) => m.DayPageModule),
  },
  {
    path: 'month',
    loadChildren: () =>
      import('./pages/month/month.module').then((m) => m.MonthPageModule),
  },
  {
    path: 'event/edit/:id',
    loadChildren: () =>
      import('./pages/event-edit/event-edit.module').then(
        (m) => m.EventEditPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
