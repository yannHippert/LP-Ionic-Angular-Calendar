import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { IEvent } from '@models/event.model';
import { EventService } from '@services/event/event.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private static dbName = 'data.dbCalendar';

  private database: SQLiteObject | undefined = undefined;
  public databaseReady = new BehaviorSubject<boolean>(false);

  constructor(private sqlite: SQLite, private EventService: EventService) {
    this.sqlite
      .create({
        name: DatabaseService.dbName,
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.createTable();
        this.databaseReady.next(true);

        EventService.getAll().subscribe((events: Array<IEvent>) => {});
      })
      .catch((e) => console.log(e));
  }

  createTable() {
    this.database?.executeSql(
      `CREATE TABLE IF NOT EXISTS tblEvent(
        id VARCHAR(255) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        startDate UNSIGNED BIGINT NOT NULL,
        endData UNSIGNED BIGINT NOT NULL,
        color VARCHAR(8) NULL,
      )`
    );
  }

  getAllEvents() {
    this.database?.executeSql('SELECT * FROM tblEvent').then((sqlEvents) => {
      console.log(sqlEvents);
    });
  }
}
