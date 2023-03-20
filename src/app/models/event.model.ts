import firebase from 'firebase/app';
import { getTimestamp } from '@utils/date';
import { variables } from '@utils/vars';

export interface IBaseEvent {
  name: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  duration?: number;
  isAllDay?: boolean;
  color?: string;
  notification?: boolean;
}

export interface IEvent extends IBaseEvent {
  id: string;
}

export const eventFactory = (id?: string): IBaseEvent | IEvent => {
  const startDate = new Date();
  startDate.setSeconds(0);
  startDate.setMinutes(0);
  startDate.setHours(startDate.getHours() + 1);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  const event = {
    id,
    name: 'New Event',
    startDate: getTimestamp(startDate),
    endDate: getTimestamp(endDate),
    color: variables.color.highlight,
    notification: false,
  };
  if (!id) delete event.id;
  return event;
};
