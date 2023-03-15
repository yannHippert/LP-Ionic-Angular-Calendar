export class Film {
  id?: string;
  country: string;
  music: string;
  onAir: boolean;
  pictureLink: string;
  productor: string;
  realisator: string;
  releaseDate: string;
  scenario: string;
  synopsis: string;
  time: string;
  title: string;

  constructor() {
    this.country = '';
    this.music = '';
    this.onAir = false;
    this.pictureLink = '';
    this.productor = '';
    this.realisator = '';
    this.releaseDate = '';
    this.scenario = '';
    this.synopsis = '';
    this.time = '';
    this.title = '';
  }
}
