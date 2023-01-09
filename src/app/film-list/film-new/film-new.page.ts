import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-film-new',
  templateUrl: './film-new.page.html',
  styleUrls: ['./film-new.page.scss'],
})
export class FilmNewPage implements OnInit {
  modif: boolean = false;

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {}

  async toggleModif() {
    if (this.modif) {
      this.modif = !this.modif;
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Header',
      subHeader: 'Subheader',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Confirm',
          handler: () => (this.modif = !this.modif),
        },
      ],
    });

    await alert.present();
  }
}
