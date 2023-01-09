import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-film-new',
  templateUrl: './film-new.page.html',
  styleUrls: ['./film-new.page.scss'],
})
export class FilmNewPage implements OnInit {
  modif: boolean = false;
  constructor() {}

  ngOnInit() {}

  toggleModif(): void {
    this.modif = !this.modif;
  }
}
