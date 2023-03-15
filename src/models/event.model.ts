import firebase from 'firebase/app';
import { getTimestamp } from 'src/utils/date';
import { variables } from 'src/utils/vars';

export interface IBaseEvent {
  name: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  duration?: number;
  isAllDay?: boolean;
  color?: string;
}

export interface IEvent extends IBaseEvent {
  id: string;
}

export const getNewEvent = () => {
  const startDate = new Date();
  const endDate = new Date();
  startDate.setMinutes(0);
  endDate.setMinutes(0);
  endDate.setHours(startDate.getHours() + 2);
  startDate.setHours(startDate.getHours() + 1);
  return {
    id: '',
    name: 'New Event',
    startDate: getTimestamp(startDate),
    endDate: getTimestamp(endDate),
    color: variables.color.highlight,
  };
};
