import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilmListPageRoutingModule } from './film-list-routing.module';

import { FilmListPage } from './film-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilmListPageRoutingModule
  ],
  declarations: [FilmListPage]
})
export class FilmListPageModule {}
