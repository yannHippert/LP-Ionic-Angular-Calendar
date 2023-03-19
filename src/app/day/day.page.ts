import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent } from '@models/event.model';
import { EventService } from '@services/event/event.service';
import { interval } from 'rxjs';
import { getTimeSlots, getTimeString } from 'src/utils/date';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
})
export class DayPage implements OnInit {
  date!: Date;
  events: Array<IEvent> = [];
  hours: Array<string> = getTimeSlots();
  currentTime!: string;

  @ViewChild('currentTimeElement', { read: ElementRef })
  currentTimeElement!: ElementRef;
  @ViewChild(IonContent) content!: IonContent;
  hasScrolled: boolean = false;

  constructor(
    private EventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.date =
        params['date'] === 'today' ? new Date() : new Date(params['date']);
      if (isNaN(this.date.getTime())) this.date = new Date();
      this.EventService.getOfDate(this.date).subscribe(
        (events: Array<IEvent>) => (this.events = events)
      );
    });

    this.currentTime = this.getCurrentTime();
    interval(1000).subscribe(() => (this.currentTime = this.getCurrentTime()));
  }

  /**
   * Attempt to scroll to the current day.
   */
  ngAfterViewChecked() {
    if (!this.hasScrolled && this.currentTimeElement) {
      const element = this.currentTimeElement.nativeElement;
      this.content.scrollToPoint(0, element.offsetTop - 150, 500);
      setTimeout(() => (this.hasScrolled = true), 250);
    }
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
