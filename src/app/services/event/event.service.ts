import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { IBaseEvent, IEvent } from '@models/event.model';
import { getNextDay, getPreviousDay, getTimestamp } from '@utils/date';
import { getTimeString } from '@utils/date';
import { NotificationService } from '@services/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private dbPath = '/events';
  eventsRef: AngularFirestoreCollection<any>;

  constructor(
    private db: AngularFirestore,
    private notificationService: NotificationService
  ) {
    this.eventsRef = db.collection(this.dbPath);
  }

  /**
   * Gets all the events
   *
   * @returns An observable of all the events
   */
  getAll(): Observable<any> {
    return this.getObservable(
      this.db.collection(this.dbPath, (ref) => ref.orderBy('startDate'))
    );
  }

  /**
   * Gets all the events of a specific date
   *
   * @param date The date of which to get the events
   * @returns An observable of the events
   */
  getOfDate(date: Date): Observable<any> {
    const previousDay = getPreviousDay(date);
    previousDay.setHours(23);
    previousDay.setMinutes(59);

    const nextDay = getNextDay(date);
    nextDay.setHours(0);
    nextDay.setMinutes(0);

    const previousTimestamp = getTimestamp(previousDay);
    const nextTimestamp = getTimestamp(nextDay);

    return this.getObservable(
      this.db.collection(this.dbPath, (ref) =>
        ref
          .where('startDate', '>', previousTimestamp)
          .where('startDate', '<', nextTimestamp)
      )
    );
  }

  /**
   * Gets all the events of a specific month
   *
   * @param date The date, which is in the month of which to get the events
   * @returns An observable of the events
   */
  getOfMonth(date: Date): Observable<any> {
    const previousMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      0,
      23,
      59
    );

    const nextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
      0,
      0
    );

    return this.getObservable(
      this.db.collection(this.dbPath, (ref) =>
        ref
          .where('startDate', '>', getTimestamp(previousMonth))
          .where('startDate', '<', getTimestamp(nextMonth))
      )
    );
  }

  /**
   * Get the event with a specific id
   *
   * @param id The id of the event to get
   * @returns
   */
  get(id: string): Promise<IEvent> {
    return new Promise((resolve, reject) => {
      this.eventsRef
        .doc(id)
        .get()
        .subscribe((res) => {
          if (res.data() === undefined) reject({ message: 'Event not found!' });
          else resolve({ id, ...res.data() });
        });
    });
  }

  /**
   * Add a new event into the database
   *
   * @param baseEvent The base event to add  to the database
   * @returns Promise<IEvent> Promise of the event to created
   */
  add(baseEvent: IBaseEvent): Promise<IEvent> {
    return new Promise(async (resolve, reject) => {
      if (baseEvent.notification === true) {
        const areNotificationsEnabled =
          await this.notificationService.areNotificationsEnabled();
        if (areNotificationsEnabled) {
          const res = await this.eventsRef.add({ ...baseEvent }).catch(reject);
          if (res === undefined) return;
          const event = { ...baseEvent, id: res.id };
          await this.notificationService
            .createNotification(event)
            .catch(reject);
          resolve(event);
        }
      } else {
        this.eventsRef
          .add({ ...baseEvent })
          .then((res) => resolve({ ...baseEvent, id: res.id }))
          .catch(reject);
      }
    });
  }

  /**
   * Updates an event
   *
   * @param event The event to update
   * @returns Promise<any> The promise to be resolved
   */
  update(event: IEvent): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (event.notification === false) {
        await this.notificationService.removeNotification(
          event.id.toHashCode()
        );
        this.eventsRef.doc(event.id).update(event).then(resolve).catch(reject);
      } else {
        this.notificationService
          .createNotification(event)
          .then(() =>
            this.eventsRef
              .doc(event.id)
              .update(event)
              .then(resolve)
              .catch(reject)
          )
          .catch(reject);
      }
    });
  }

  /**
   * Deletes an event
   *
   * @param id The id of the event to delete
   * @returns Promise<any> The promise to be resolved
   */
  delete(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.notificationService
        .removeNotification(id.toHashCode())
        .then(() => this.eventsRef.doc(id).delete().then(resolve).catch(reject))
        .catch(reject);
    });
  }

  /**
   * Takes a request to get event add the necessary functions to make it an observable
   *
   * @param dataCall The request to the server to get the events
   * @returns Observable<Array<IEvent>> Observable of the events specified int the dataCall parameter
   */
  private getObservable(
    dataCall: AngularFirestoreCollection<unknown>
  ): Observable<Array<IEvent>> {
    return dataCall.snapshotChanges().pipe(
      map((changes) =>
        changes.map(({ payload }: any) => ({
          id: payload.doc.id,
          ...payload.doc.data(),
        }))
      )
    );
  }
}
