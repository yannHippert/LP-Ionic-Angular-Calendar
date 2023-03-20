import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventEditPageRoutingModule } from './event-edit-routing.module';

import { EventEditPage } from './event-edit.page';
import { EventModModule } from '@components/event-mod/event-mod.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventEditPageRoutingModule,
    EventModModule,
  ],
  declarations: [EventEditPage],
})
export class EventEditPageModule {}
