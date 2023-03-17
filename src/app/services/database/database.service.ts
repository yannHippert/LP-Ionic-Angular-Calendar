import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import '@capacitor-community/sqlite';
import { JsonSQLite } from '@capacitor-community/sqlite';

import { Plugins } from '@capacitor/core';
import { EventService } from '@services/event/event.service';
import { IEvent } from '@models/event.model';
const { CapacitorSQLite, Device, Storage } = Plugins;

import DB_SCHEMA from './schema.json';

// https://devdactic.com/sqlite-ionic-app-with-capacitor
// https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-Angular-Usage.md

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  dbReady = new BehaviorSubject(false);
  dbName = '';

  constructor(
    private alertCtrl: AlertController,
    private EventService: EventService
  ) {
    this.dbName = DB_SCHEMA.database;
  }

  async init(): Promise<void> {
    const info = await Device['getInfo']();

    if (info.platform === 'android') {
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        this.setupDatabase();
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'No DB access',
          message: 'Database access is required for offline functionality.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      this.setupDatabase();
    }
  }

  private async setupDatabase() {
    console.log('Setting up database');
    const dbSetupDone = await Storage['get']({ key: this.dbName });

    if (!dbSetupDone) {
      this.createDatabase();
    } else {
      await CapacitorSQLite['open']({ database: this.dbName });
      this.dbReady.next(true);
      this.updateDatabase();
    }
  }

  private async createDatabase() {
    console.log('Creating database');
    const isSetup = await Storage['get']({ key: this.dbName });
    if (!isSetup) {
      const isValid = await CapacitorSQLite['isJsonValid']({
        jsonstring: JSON.stringify(DB_SCHEMA),
      });
      if (isValid.result) {
        await CapacitorSQLite['importFromJson']({ jsonstring: DB_SCHEMA });
        await Storage['set']({ key: this.dbName, value: '1' });
        console.log('Database created');
      }
    }
    this.dbReady.next(true);
    this.updateDatabase();
  }

  private async updateDatabase() {
    console.log('Update database call');
    this.dbReady.subscribe((isReady) => {
      if (isReady) {
        this.EventService.getAll().subscribe((events: Array<IEvent>) => {
          console.log('Event updates -> Updateing database');
          const statement = `TRUNCATE TABLE tblEvents;`;
          CapacitorSQLite['query']({ statement, values: [] });
        });
      }
    });
  }

  getEvents(): Observable<any> {
    console.log('Retrieving events from database');
    return this.dbReady.pipe(
      switchMap((isReady) => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          const statement = 'SELECT * FROM tblEvents;';
          return from(CapacitorSQLite['query']({ statement, values: [] }));
        }
      })
    );
  }

  getEventById(eventId: string) {
    console.log(`Retrieving event with id ${eventId} from database`);
    return this.dbReady.pipe(
      switchMap((isReady) => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          const statement = `SELECT * FROM tblEvents WHERE idEvent=${eventId};`;
          return from(CapacitorSQLite['query']({ statement, values: [] }));
        }
      })
    );
  }
}
