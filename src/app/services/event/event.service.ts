import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { IBaseEvent, IEvent } from '@models/event.model';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getNextDay, getPreviousDay, getTimestamp } from '@utils/date';
import { getTimeString } from '@utils/date';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private dbPath = '/events';
  eventsRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
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

  get(id: any): any {
    return new Observable((obs) => {
      this.eventsRef
        .doc(id)
        .get()
        .subscribe((res) => {
          if (res.data() === undefined) obs.error();
          else obs.next({ id, ...res.data() });
        });
    });
  }

  add(event: IBaseEvent): Promise<any> {
    return new Promise((resolve) => {
      this.eventsRef.add({ ...event }).then((res) => {
        if (event.notification === true) {
          this.createNotification({ ...event, id: res.id }).then(() =>
            resolve(res)
          );
        } else {
          resolve(res);
        }
      });
    });
  }

  update(event: IEvent): Promise<any> {
    return Promise.all([
      this.createNotification(event),
      this.eventsRef.doc(event.id).update(event),
    ]);
  }

  delete(id: string): Promise<any> {
    return Promise.all([
      this.eventsRef.doc(id).delete(),
      this.removeNotification(id),
    ]);
  }

  private getObservable(dataCall: AngularFirestoreCollection<unknown>) {
    return dataCall.snapshotChanges().pipe(
      map((changes) =>
        changes.map(({ payload }: any) => {
          return {
            id: payload.doc.id,
            ...payload.doc.data(),
          };
        })
      )
    );
  }

  private createNotification = (event: IEvent): Promise<void> => {
    console.log(
      `Scheduling a notification for the event ${
        event.name
      } at ${event.startDate.toDate()}`
    );
    return new Promise(async (resolve) => {
      await this.removeNotification(event.id);
      LocalNotifications.schedule({
        notifications: [
          {
            title: event.name,
            body: `${getTimeString(event.startDate.toDate())} - ${getTimeString(
              event.endDate.toDate()
            )}`,
            id: event.id.toHashCode(),
            schedule: { at: event.startDate.toDate() },
          },
        ],
      }).then(() => {
        console.log('Notification scheduled');
        resolve();
      });
    });
  };

  private removeNotification = (id: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const pendingNotifications = await LocalNotifications.getPending();
      if (
        pendingNotifications.notifications.some(
          (notif) => notif.id === id.toHashCode()
        )
      ) {
        LocalNotifications.cancel({
          notifications: [{ id: id.toHashCode() }],
        }).then(() => {
          console.log('Notification removed');
          resolve();
        });
      } else {
        resolve();
      }
    });
  };
}
