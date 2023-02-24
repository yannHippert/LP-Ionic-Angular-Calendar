import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { IBaseEvent, IEvent } from 'src/app/models/event.model';
import { getNextDay, getPreviousDay, getTimestamp } from 'src/utils/date';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private dbPath = '/events';
  eventsRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.eventsRef = db.collection(this.dbPath);
  }

  getAll(): any {
    return new Observable((obs) => {
      this.db
        .collection(this.dbPath, (ref) => ref.orderBy('startDate'))
        .get()
        .pipe(
          map((querySnapshot) =>
            querySnapshot.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            })
          )
        )
        .subscribe((documents) => {
          obs.next(documents);
        });
    });
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

    return new Observable((obs) => {
      this.db
        .collection(this.dbPath, (ref) =>
          ref
            .where('startDate', '>', previousTimestamp)
            .where('startDate', '<', nextTimestamp)
        )
        .get()
        .pipe(
          map((querySnapshot) =>
            querySnapshot.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            })
          )
        )
        .subscribe((documents) => {
          obs.next(documents);
        });
    });
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

    const previousTimestamp = getTimestamp(previousMonth);
    const nextTimestamp = getTimestamp(nextMonth);

    return new Observable((obs) => {
      this.db
        .collection(this.dbPath, (ref) =>
          ref
            .where('startDate', '>', previousTimestamp)
            .where('startDate', '<', nextTimestamp)
        )
        .get()
        .pipe(
          map((querySnapshot) =>
            querySnapshot.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            })
          )
        )
        .subscribe((documents) => {
          obs.next(documents);
        });
    });
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

  add(event: IBaseEvent): any {
    return new Observable((obs) => {
      this.eventsRef.add({ ...event }).then(() => {
        obs.next();
      });
    });
  }

  update(event: IEvent) {
    return new Observable((obs) => {
      this.eventsRef
        .doc(event.id)
        .update(event)
        .then(() => {
          obs.next();
        });
    });
  }

  delete(id: string) {
    return new Observable((obs) => {
      this.eventsRef
        .doc(id)
        .delete()
        .then(() => {
          obs.next();
        });
    });
  }
}
