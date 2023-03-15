import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEvent } from '@models/event.model';
import { IDay } from '@models/day.model';
import { EventService } from '@services/event/event.service';
import {
  getDateString,
  getMonthString,
  getNextMonth,
  getNumberOfDays,
  getPreviousMonth,
  getWeekdays,
  isSameDay,
  isSameMonth,
  isToday,
} from 'src/utils/date';

@Component({
  selector: 'app-month',
  templateUrl: './month.page.html',
  styleUrls: ['./month.page.scss'],
})
export class MonthPage implements OnInit {
  rows = 6;
  days: Array<IDay> = [];
  date = new Date();

  constructor(private EventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.handleDateChange();
  }

  range = (min: number, max: number): Array<number> => {
    return Array(max - min)
      .fill(0)
      .map((x, i) => min + i);
  };

  isActiveMonth = (date: Date): boolean => {
    return isSameMonth(this.date, date);
  };

  /**
   * Creates an array of days, with the events, of a given date.
   *
   * @param date The date/month of which to get the days
   * @returns An array consisting of the days of the month
   *  with all the events of the days.
   */
  getDays = (date: Date): Array<IDay> => {
    const days: Array<IDay> = [];
    for (let i = 1; i <= getNumberOfDays(date); i++) {
      const day = {
        date: new Date(date.getFullYear(), date.getMonth(), i),
        events: [],
      } as IDay;
      if (isToday(day.date)) day.isToday = true;
      days.push(day);
    }
    // Add the events to the day

    this.EventService.getOfMonth(date).subscribe((events: Array<IEvent>) => {
      events.forEach((event: IEvent) => {
        const day = days.find((day: IDay) =>
          isSameDay(event.startDate.toDate(), day.date)
        );
        day?.events.push(event);
      });
    });

    return days;
  };

  /**
   * @returns The formatted string of the current date.
   */
  getMonth = () => getMonthString(this.date);

  /**
   * @returns The year of the current date.
   */
  getYear = () => this.date.getFullYear();

  getDateString = (date: Date) => getDateString(date);

  handleClick = (date: Date) => {
    this.router.navigate(['tabs/day/' + getDateString(date)]);
  };

  /**
   * Handles the change to the previous month
   */
  onPreviousMonth = () => {
    this.date = getPreviousMonth(this.date);
    this.handleDateChange();
  };

  /**
   * Handles the change to the next month
   */
  onNextMonth = () => {
    this.date = getNextMonth(this.date);
    this.handleDateChange();
  };

  /**
   * Handles the change to an other month.
   * Genereates the spacers an fillers to align the days of
   * the current month properly.
   */
  handleDateChange = () => {
    const days = this.getDays(this.date);
    let firstDay = days[0];
    const numberOfSpacers =
      firstDay.date.getDay() === 0 ? 6 : firstDay.date.getDay() - 1;
    let spacers = [] as Array<IDay>;
    if (numberOfSpacers !== 0) {
      const previousMonth = getPreviousMonth(this.date);
      spacers = this.getDays(previousMonth).slice(-numberOfSpacers);
    }
    const nextMonth = getNextMonth(this.date);
    const numberOfFillers = this.rows * 7 - (spacers.length + days.length);
    const fillers = this.getDays(nextMonth).slice(0, numberOfFillers);
    this.days = [...spacers, ...days, ...fillers];
  };

  /**
   * Navigates the user to the clicked day.
   * @param day The day which was clicked.
   */
  onDayClick(day: IDay) {
    this.router.navigate(['day/' + getDateString(day.date)]);
  }

  /**
   * @returns An array containing the 7 days of the week.
   */
  getWeekdays(): Array<string> {
    return getWeekdays();
  }
}
