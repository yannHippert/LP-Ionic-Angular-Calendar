import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { IBaseEvent, IEvent } from 'src/models/event.model';
import { getNextDay, getPreviousDay, getTimestamp } from 'src/utils/date';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getTimeString } from 'src/utils/date';

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
        this.createNotification({ ...event, id: res.id }).then(() =>
          resolve(res)
        );
      });
    });
  }

  update(event: IEvent): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.createNotification(event);
      this.eventsRef.doc(event.id).update(event).then(resolve);
    });
  }

  delete(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.removeNotification(id);
      this.eventsRef.doc(id).delete().then(resolve);
    });
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

declare global {
  interface String {
    toHashCode(): number;
  }
}

String.prototype.toHashCode = function (): number {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
