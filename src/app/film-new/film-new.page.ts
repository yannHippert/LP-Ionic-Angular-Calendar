import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Film } from 'src/app/models/film.model';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-new',
  templateUrl: './film-new.page.html',
  styleUrls: ['./film-new.page.scss'],
})
export class FilmNewPage implements OnInit {
  public film!: Film;

  constructor(
    private Film: FilmService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.film = new Film();
  }

  async presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Nouveau Film enregistré',
      duration: 2000,
    });
    (await toast).present().then(() => {
      setTimeout(() => {
        this.router.navigate(['/tabs/films']);
      }, 2000);
    });
  }

  add() {
    this.Film.saveNewFilm(this.film).subscribe(() => {
      this.film = new Film();
      this.presentToast();
    });
  }
}
