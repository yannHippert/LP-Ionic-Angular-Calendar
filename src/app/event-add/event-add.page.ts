import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBaseEvent } from '@models/event.model';
import { EventService } from '@services/event/event.service';
import { getDateString, getTimestamp } from 'src/utils/date';
import { variables } from 'src/utils/vars';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.page.html',
  styleUrls: ['./event-add.page.scss'],
})
export class EventAddPage implements OnInit {
  event!: IBaseEvent;

  constructor(private EventService: EventService, private router: Router) {}

  /**
   * Handles the initial setup of the component.
   * Creates a new/empty event.
   */
  ngOnInit(): void {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setMinutes(0);
    endDate.setMinutes(0);
    endDate.setHours(startDate.getHours() + 2);
    startDate.setHours(startDate.getHours() + 1);
    this.event = {
      name: 'New Event',
      startDate: getTimestamp(startDate),
      endDate: getTimestamp(endDate),
      color: variables.color.highlight,
    };
  }

  /**
   * Creates the new event and refirects the user
   * to the page of the day of the event.
   */
  onCreate() {
    if (this.event.name.trim().length > 0)
      this.EventService.add(this.event).then(() => {
        this.router.navigate([
          'tabs/day/' + getDateString(this.event.startDate.toDate()),
        ]);
      });
  }

  /**
   * In case, the user cancels the creation, redirects the user to
   * the calendar page.
   */
  onCancel() {
    this.router.navigate(['calendar']);
  }
}
