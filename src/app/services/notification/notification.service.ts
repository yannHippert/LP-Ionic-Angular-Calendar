import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { IEvent } from '@models/event.model';
import { getTimeString } from '@utils/date';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  /**
   * Checks if the user has notifications enabled or not,
   * if the user has not yet been asked for permission, he get promted.
   *
   * @returns Promise<boolean> indicating if the user has notifications enabled or not
   */
  areNotificationsEnabled(): Promise<boolean> {
    return new Promise(async (resolve) => {
      let permissionStatus = (await LocalNotifications.checkPermissions())
        .display;
      if (permissionStatus === 'prompt') {
        permissionStatus = (await LocalNotifications.requestPermissions())
          .display;
      }
      resolve(permissionStatus === 'granted');
    });
  }

  /**
   * Created a notification for an event, if they are enabled
   *
   * @param event The event for which to create a notification
   * @returns Promise<void>
   */
  createNotification = (event: IEvent): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (await this.areNotificationsEnabled()) {
        await this.removeNotification(event.id.toHashCode());
        console.log(
          `Scheduling a notification for the event ${
            event.name
          } at ${event.startDate.toDate()}`
        );

        LocalNotifications.schedule({
          notifications: [
            {
              title: event.name,
              body: `${getTimeString(
                event.startDate.toDate()
              )} - ${getTimeString(event.endDate.toDate())}`,
              id: event.id.toHashCode(),
              schedule: { at: event.startDate.toDate() },
            },
          ],
        })
          .then(() => {
            console.log('Notification scheduled');
            resolve();
          })
          .catch(reject);
      } else {
        reject({ message: 'Notification permission not granted!' });
      }
    });
  };

  /**
   * Removes the notification of a the event with the given id, if it exists.
   *
   * @param id The if of the notification to remove
   * @returns Promise<void>
   */
  removeNotification = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const pendingNotifications = await LocalNotifications.getPending();
      if (pendingNotifications.notifications.some((notif) => notif.id === id)) {
        LocalNotifications.cancel({
          notifications: [{ id }],
        })
          .then(() => {
            console.log('Notification removed');
            resolve();
          })
          .catch(reject);
      } else {
        resolve();
      }
    });
  };
}
