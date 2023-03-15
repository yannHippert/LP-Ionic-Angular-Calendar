import { IEvent } from './event.model';

export interface IDay {
  date: Date;
  events: Array<IEvent>;
  isToday?: boolean;
}
