import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DayPageRoutingModule } from './day-routing.module';

import { DayPage } from './day.page';
import { DayEventComponent } from '@components/day-event/day-event.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DayPageRoutingModule],
  declarations: [DayPage, DayEventComponent],
})
export class DayPageModule {}
