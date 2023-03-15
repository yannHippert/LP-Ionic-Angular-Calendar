import { Component, Input, OnInit } from '@angular/core';
import { IEvent } from '@models/event.model';
import { Router } from '@angular/router';
import { isAllDay } from 'src/utils/date';
import { variables } from 'src/utils/vars';

@Component({
  selector: 'app-day-event',
  templateUrl: './day-event.component.html',
  styleUrls: ['./day-event.component.scss'],
})
export class DayEventComponent implements OnInit {
  @Input() event!: IEvent;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.event.duration = this.getDuration();
    this.event.isAllDay = this.isAllDay();
  }

  /**
   * @returns A string consiting of the amount of pixels,
   *  the event has to be from the top.
   */
  getTopOffset(): string {
    const date = this.event.startDate.toDate();
    return date.getHours() * 60 + date.getMinutes() + 20 + 'px';
  }

  /**
   * @returns The duration of the event in minutes
   */
  getDuration(): number {
    return (this.event.endDate.seconds - this.event.startDate.seconds) / 60;
  }

  /**
   * @returns The hight of the event, relative to its duration, in pixels.
   */
  getHeight(): string {
    return this.getDuration() + 'px';
  }

  /**
   * @returns The color of the event with a default value if the event has no color
   */
  getBgColor(): string {
    return this.event.color || variables.color.highlight;
  }

  /**
   * Handles the navigation to the edit page.
   */
  onClick(): void {
    this.router.navigate(['event/edit/' + this.event.id]);
  }

  /**
   * @returns Boolean indicating if the event is all-day long.
   */
  isAllDay(): boolean {
    return isAllDay(this.event.startDate.toDate(), this.event.endDate.toDate());
  }
}
