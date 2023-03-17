import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import '@capacitor-community/sqlite';
import { JsonSQLite } from '@capacitor-community/sqlite';

import { Plugins } from '@capacitor/core';
import { EventService } from '@services/event/event.service';
import { IEvent } from '@models/event.model';
const { CapacitorSQLite, Device, Storage } = Plugins;

const DB_SETUP_KEY = 'events_db_setup';
const DB_NAME_KEY = 'dbEvents';

// https://devdactic.com/sqlite-ionic-app-with-capacitor

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  dbReady = new BehaviorSubject(false);
  dbName = '';

  constructor(
    private alertCtrl: AlertController,
    private EventService: EventService
  ) {}

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
    const dbSetupDone = await Storage['get']({ key: DB_SETUP_KEY });

    if (!dbSetupDone.value) {
      this.downloadDatabase();
    } else {
      this.dbName = (await Storage['get']({ key: DB_NAME_KEY })).value;
      await CapacitorSQLite['open']({ database: this.dbName });
      this.dbReady.next(true);
    }
  }

  private updateDatabaseData() {
    this.EventService.getAll().subscribe((events: Array<IEvent>) => {});
  }
  private downloadDatabase(update = false) {
    this.http
      .get('https://devdactic.fra1.digitaloceanspaces.com/tutorial/db.json')
      .subscribe(async (jsonExport: JsonSQLite) => {
        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

        if (isValid.result) {
          this.dbName = jsonExport.database;
          await Storage.set({ key: DB_NAME_KEY, value: this.dbName });
          await CapacitorSQLite.importFromJson({ jsonstring });
          await Storage.set({ key: DB_SETUP_KEY, value: '1' });

          // Your potential logic to detect offline changes later
          if (!update) {
            await CapacitorSQLite.createSyncTable();
          } else {
            await CapacitorSQLite.setSyncDate({
              syncdate: '' + new Date().getTime(),
            });
          }
          this.dbReady.next(true);
        }
      });
  }
}
