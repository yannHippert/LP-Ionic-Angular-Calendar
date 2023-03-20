import { Component, Input, SimpleChanges } from '@angular/core';
import { IBaseEvent } from '@models/event.model';
import { NotificationService } from '@services/notification/notification.service';
import {
  getDateString,
  getTimestamp,
  getTimeString,
  isAllDay,
} from '@utils/date';
import { variables } from '@utils/vars';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-event-mod',
  templateUrl: './event-mod.component.html',
  styleUrls: ['./event-mod.component.scss'],
})
export class EventModComponent {
  @Input() event!: IBaseEvent;
  allDay: boolean = false;
  startDateString: string = '';
  startTimeString: string = '';
  endTimeString: string = '';

  constructor(
    private notificationService: NotificationService,
    private toastController: ToastController
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.event.color) this.event.color = variables.color.highlight;
    const startDate = this.event.startDate.toDate();
    const endDate = this.event.endDate.toDate();
    this.updateDateStrings(startDate, endDate);
    this.allDay = isAllDay(startDate, endDate);
  }

  /**
   * Checks if the name of the event is valid.
   * @returns A boolean indicating if the name is valid or not
   */
  isValidTitle(): boolean {
    return this.event.name.trim().length > 0;
  }

  /**
   * Handles the change of the all-day switch.
   */
  onAllDayChange() {
    const newStart = this.event.startDate.toDate() as Date;
    const newEnd = this.event.startDate.toDate() as Date;
    if (this.allDay) {
      // From 00:00 to 23:59
      newStart.setHours(0);
      newStart.setMinutes(0);
      newEnd.setHours(23);
      newEnd.setMinutes(59);
    } else {
      // From now to now + 1h
      const now = new Date();
      newStart.setHours(now.getHours() + 1);
      newEnd.setHours(now.getHours() + 2);
      newEnd.setMinutes(0);
    }
    this.event.startDate = getTimestamp(newStart);
    this.event.endDate = getTimestamp(newEnd);

    this.updateDateStrings(newStart, newEnd);
  }

  /**
   * Updates the string, used by the inputs, to the values
   * of the given input.
   *
   * @param startDate The startdate of the event
   * @param endDate the enddate of the event
   */
  updateDateStrings(startDate: Date, endDate: Date): void {
    this.startDateString = getDateString(startDate);
    this.startTimeString = getTimeString(startDate);
    this.endTimeString = getTimeString(endDate);
  }

  /**
   * @returns The start-date from the strings, used by the inputs.
   */
  getStartDate(): Date {
    return new Date(this.startDateString + ' ' + this.startTimeString);
  }

  /**
   * @returns The end-date from the strings, used by the inputs.
   */
  getEndDate(): Date {
    return new Date(this.startDateString + ' ' + this.endTimeString);
  }

  /**
   * Checks if the enetered values of the event are valid
   * and updates the event locally.
   */
  onDateChange(): void {
    const startDate = this.getStartDate();
    const endDate = this.getEndDate();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    if (startTime >= endTime) {
      endDate.setHours(Math.min(startDate.getHours() + 1, 23));
      endDate.setMinutes(startDate.getHours() === 23 ? 59 : 0);
      this.updateDateStrings(startDate, endDate);
    }

    this.event.startDate = getTimestamp(startDate);
    this.event.endDate = getTimestamp(endDate);
  }

  onNotificationChange(): void {
    this.notificationService
      .areNotificationsEnabled()
      .then(async (isEnabled) => {
        if (!isEnabled) {
          this.event.notification = false;
          const toast = await this.toastController.create({
            message: 'You have not enabled notifications',
            duration: 2000,
            position: 'top',
            color: 'danger',
          });
          toast.present();
        }
      });
  }
}
