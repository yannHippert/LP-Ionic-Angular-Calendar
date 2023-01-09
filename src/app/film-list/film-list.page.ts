import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.page.html',
  styleUrls: ['./film-list.page.scss'],
})
export class FilmListPage implements OnInit {
  film = {
    title: 'test',
    img: '/assets/imgs/noimg.png',
    param1: 'test param 1',
    param2: 'test param 2',
  };

  films: Array<any> = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 5; i++) {
      this.films.push({ id: i, ...this.film });
    }
  }
}
