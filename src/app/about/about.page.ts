import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  sections: Array<number> = [1, 2, 3];

  constructor() {}

  ngOnInit() {}
}
