import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { eventFactory, IEvent } from 'src/app/models/event.model';
import { EventService } from '@services/event/event.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.page.html',
  styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit {
  event!: IEvent;

  constructor(
    private EventService: EventService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  /**
   * Gets the id of the event to edit from the url.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.event = eventFactory(id) as IEvent;
    this.loadEvent(id);
  }

  /**
   * Checks if the name of the event is valid.
   * @returns A boolean indicating if the name is valid or not
   */
  isValidTitle(): boolean {
    return this.event.name.trim().length > 0;
  }

  /**
   * Function to display a toast message
   *
   * @param message the message to be shown in the toest
   * @param isError boolean indiacting if it is an error message or not
   */
  presentToast(message: string, isError: boolean = false) {
    this.toastController
      .create({
        message,
        duration: 2000,
        position: 'top',
        color: isError ? 'danger' : 'success',
      })
      .then((toast) => toast.present());
  }

  /**
   * Makes the request to the service to get the event,
   * in case the event does not exist, redirects the user
   * to the current day.
   *
   * @param id The id of the event to be editted.
   */
  loadEvent(id: string): void {
    this.EventService.get(id)
      .then((event: IEvent) => (this.event = event))
      .catch((error: any) => {
        this.presentToast(error.message, true);
        this.navCtrl.back();
      });
  }

  /**
   * Handles the updating of the event.
   */
  onUpdate() {
    if (this.isValidTitle()) {
      this.EventService.update(this.event)
        .then(() => {
          this.presentToast('Event updated');
          this.navCtrl.back();
        })
        .catch((error) => this.presentToast(error.message, true));
    } else {
      this.presentToast('The title cannot be empty', true);
    }
  }

  /**
   * Handles the canceling of the event, which is redirecting the user
   * to the view of the day of the event.
   */
  onCancel() {
    this.navCtrl.back();
  }

  /**
   * Handles the deleting of the event, and redirects the user
   * to the view of the day of the event.
   */
  onDelete() {
    this.EventService.delete(this.event.id)
      .then(() => {
        this.presentToast('Event deleted');
        this.navCtrl.back();
      })
      .catch((error) => this.presentToast(error.message, true));
  }
}
