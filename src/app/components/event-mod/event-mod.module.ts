import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventModComponent } from './event-mod.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [EventModComponent],
  exports: [EventModComponent],
})
export class EventModModule {}
