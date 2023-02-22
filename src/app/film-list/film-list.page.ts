import { Component, OnInit } from '@angular/core';
import { FilmService } from '../services/film.service';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.page.html',
  styleUrls: ['./film-list.page.scss'],
})
export class FilmListPage implements OnInit {
  films!: any;
  constructor(private Film: FilmService) {}

  ngOnInit(): void {
    this.Film.getAllFilms().subscribe((data: any) => {
      this.films = data;
    });
  }
}
