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

  getAll(): Observable<any> {
    return this.getObservable(
      this.db.collection(this.dbPath, (ref) => ref.orderBy('startDate'))
    );
  }

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

  add(baseEvent: IBaseEvent): Promise<any> {
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

  update(event: IEvent): Promise<void> {
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

  delete(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.notificationService
        .removeNotification(id.toHashCode())
        .then(() => this.eventsRef.doc(id).delete().then(resolve).catch(reject))
        .catch(reject);
    });
  }

  private getObservable(dataCall: AngularFirestoreCollection<unknown>) {
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
