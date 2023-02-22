import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilmListPage } from './film-list.page';

const routes: Routes = [
  {
    path: '',
    component: FilmListPage,
  },
  {
    path: 'new',
    loadChildren: () =>
      import('../film-new/film-new.module').then((m) => m.FilmNewPageModule),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('../film/film.module').then((m) => m.FilmPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilmListPageRoutingModule {}
