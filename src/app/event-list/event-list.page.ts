import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IEvent } from '@models/event.model';
import { IDay } from '@models/day.model';
import { EventService } from '@services/event/event.service';
import {
  getLongDateString,
  getTimeString,
  isSameDay,
  isToday,
} from 'src/utils/date';
import { variables } from 'src/utils/vars';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss'],
})
export class EventListPage implements OnInit {
  days: Array<IDay> = [];

  @ViewChild('todayElem', { read: ElementRef }) todayElemRef!: ElementRef;

  constructor(private EventService: EventService, private router: Router) {}

  /**
   * Handles the initial setup of the component,
   * which consists of getting all the events and regrouping the by day.
   */
  ngOnInit(): void {
    this.EventService.getAll().subscribe((events: Array<IEvent>) => {
      let hasToday = false;
      let day: undefined | IDay = undefined;
      events.forEach((event: IEvent) => {
        if (
          day === undefined ||
          !isSameDay(day.date, event.startDate.toDate())
        ) {
          if (day !== undefined) this.days.push(day);

          if (!hasToday) hasToday = isToday(event.startDate.toDate());
          day = {
            date: event.startDate.toDate(),
            events: [event],
          };
        } else {
          day.events.push(event);
        }
      });
      if (day !== undefined) this.days.push(day);

      // If today has no event, creates a day for today anyway and sorts
      // the days again.
      if (!hasToday) {
        this.days.push({
          date: new Date(),
          events: [],
        });

        this.days.sort(
          (a: IDay, b: IDay) => a.date.getTime() - b.date.getTime()
        );
      }
    });
  }

  /**
   * Attempt to scroll to the current day.
   * Not working...
   */
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.todayElemRef) this.todayElemRef.nativeElement.scrollIntoView();
    }, 250);
  }

  /**
   * @param date The date to be formatted
   * @returns The formatted string of the date.
   */
  getLongDateString(date: Date): string {
    return getLongDateString(date);
  }

  /**
   * @param date The date to be checked
   * @returns A boolean indicating if the date is today.
   */
  isToday(date: Date): boolean {
    return isToday(date);
  }

  getStartTime(event: IEvent): string {
    return getTimeString(event.startDate.toDate());
  }

  getEndTime(event: IEvent): string {
    return getTimeString(event.endDate.toDate());
  }

  /**
   * Creates the formatted string of the timespan of the event.
   * @param event The event of which to get the timespan.
   * @returns The formatted timespan.
   */
  getTimeSpan(event: IEvent): string {
    return `${getTimeString(event.startDate.toDate())} - ${getTimeString(
      event.endDate.toDate()
    )}`;
  }

  /**
   * Get the color of an event or the default color if the event has none.
   *
   * @param event The event to get the color of
   * @returns The color of the event or the default color
   */
  getBgColor(event: IEvent): string {
    return event.color || variables.color.highlight;
  }

  /**
   *
   * @param event
   */
  onEventClick(event: IEvent) {
    this.router.navigate(['event/edit/' + event.id]);
  }
}
