import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { eventFactory, IBaseEvent } from 'src/app/models/event.model';
import { EventService } from '@services/event/event.service';
import { getDateString, getTimestamp } from 'src/utils/date';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.page.html',
  styleUrls: ['./event-add.page.scss'],
})
export class EventAddPage {
  event: IBaseEvent = eventFactory();

  constructor(
    private EventService: EventService,
    private router: Router,
    private toastController: ToastController
  ) {}

  /**
   * Checks if the name of the event is valid.
   * @returns A boolean indicating if the name is valid or not
   */
  isValidTitle(): boolean {
    return this.event.name.trim().length > 0;
  }

  async presentToast(message: string, isError: boolean = false) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }

  /**
   * Creates the new event and refirects the user
   * to the page of the day of the event.
   */
  onCreate() {
    if (this.isValidTitle()) {
      this.EventService.add(this.event)
        .then(() => {
          this.presentToast('Event created');
          this.event = eventFactory();
          this.router.navigate([
            'tabs/day/' + getDateString(this.event.startDate.toDate()),
          ]);
        })
        .catch((error: any) => {
          this.presentToast(error.message, true);
        });
    } else {
      this.presentToast('The title cannot be empty', true);
    }
  }
}
