import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IEvent } from '@models/event.model';
import { EventService } from '@services/event/event.service';
import { interval } from 'rxjs';
import { getTimeSlots, getTimeString } from 'src/utils/date';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
})
export class DayPage implements OnInit {
  date!: Date;
  events: Array<IEvent> = [];
  hours: Array<string> = [];
  currentTime!: string;

  constructor(
    private EventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.hours = getTimeSlots();

    this.route.params.subscribe((params) => {
      this.date =
        params['date'] === 'today' ? new Date() : new Date(params['date']);
      if (isNaN(this.date.getTime())) this.date = new Date();
      this.EventService.getOfDate(this.date).subscribe(
        (events: Array<any>) => (this.events = events)
      );
    });

    this.currentTime = this.getCurrentTime();
    interval(1000).subscribe(() => (this.currentTime = this.getCurrentTime()));
  }

  /**
   * @returns The formatted date.
   */
  getDate = (): string => {
    return this.date.toLocaleDateString('de-De');
  };

  /**
   * @returns A string consiting of the amount of pixels,
   *  the current-time indicator has to be from the top.
   */
  getTimeOffset(): string {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes() + 10 + 'px';
  }

  /**
   * @returns A string of the current time.
   */
  getCurrentTime(): string {
    return getTimeString(new Date());
  }
}
