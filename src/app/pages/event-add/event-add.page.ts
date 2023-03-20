import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { eventFactory, IBaseEvent } from 'src/app/models/event.model';
import { EventService } from '@services/event/event.service';
import { getDateString, getTimestamp } from 'src/utils/date';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.page.html',
  styleUrls: ['./event-add.page.scss'],
})
export class EventAddPage {
  event: IBaseEvent = eventFactory();

  constructor(private EventService: EventService, private router: Router) {}

  /**
   * Creates the new event and refirects the user
   * to the page of the day of the event.
   */
  onCreate() {
    if (this.event.name.trim().length > 0)
      this.EventService.add(this.event).then(() => {
        this.event = eventFactory();
        this.router.navigate([
          'tabs/day/' + getDateString(this.event.startDate.toDate()),
        ]);
      });
  }
}
