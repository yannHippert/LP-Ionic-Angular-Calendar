import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonthPageRoutingModule } from './month-routing.module';

import { MonthPage } from './month.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonthPageRoutingModule
  ],
  declarations: [MonthPage]
})
export class MonthPageModule {}
