import firebase from 'firebase/app';

/**
 * Checks if a date is the date of today.
 *
 * @param date The date to check
 * @returns A boolean indicating if the given date is today.
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(today, date);
};

/**
 * Checks if two dates are in the same month.
 *
 * @param d1 The first date
 * @param d2 The second date
 * @returns A boolean indicating if the two dates are in the same month.
 */
export const isSameMonth = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

/**
 * Checks if two dates are the same day.
 *
 * @param d1 The first date
 * @param d2 The second date
 * @returns A boolean indicating if the two days are the same day.
 */
export const isSameDay = (d1: Date, d2: Date): boolean =>
  isSameMonth(d1, d2) && d1.getDate() === d2.getDate();

/**
 * Checks if two dates create a time-span, that covers a whole day.
 *
 * @param startDate The start-date
 * @param endDate The end-date
 * @returns A boolean indicating if the time-span of the two dates, is a full day.
 */
export const isAllDay = (startDate: Date, endDate: Date): boolean => {
  return (
    isSameDay(startDate, endDate) &&
    getTimeString(startDate) === '00:00' &&
    getTimeString(endDate) === '23:59'
  );
};

/**
 * Get the number of days of a given date/month
 *
 * @param date The date to get the number days of
 * @returns The number of days of the date/month.
 */
export const getNumberOfDays = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Creates a new date of the previous day of the given date and returns it.
 *
 * @param date The date of which to get the previous day.
 * @returns The date of the previous day.
 */
export const getPreviousDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
};

/**
 * Creates a new date of the first day of the previous month
 * of the given date and returns it.
 *
 * @param date The date of which to get the previous month.
 * @returns The date of the first day of the previous month.
 */
export const getPreviousMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

/**
 * Creates a new date of the next day of the given date and returns it.
 *
 * @param date The date of which to get the next day.
 * @returns The date of the next day.
 */
export const getNextDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
};

/**
 * Creates a new date of the first day of the next month
 * of the given date and returns it.
 *
 * @param date The date of which to get the next month.
 * @returns The date of the first day of the next month.
 */
export const getNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

/**
 * Formats the date in a given way and return the string.
 *
 * @param date The date to be formatted
 * @returns The formatted string of the date
 */
export const getDateString = (date: Date): string => {
  return date.toLocaleDateString('fr-CA');
};

/**
 * Formats the given day in a longer format.
 *
 * @param date The date to be formatted
 * @returns The formatted string of the date
 */
export const getLongDateString = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const weekday = weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1];
  const formattedDate = date.toLocaleDateString('en-DE', options);

  return `${weekday}, ${formattedDate}`;
};

/**
 * Formats the time of a date to be hh:mm,
 *
 * @param date The date of which to format the time.
 * @returns The formatted string of the time.
 */
export const getTimeString = (date: Date): string => {
  return (
    date.getHours().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    ':' +
    date.getMinutes().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  );
};

/**
 * Returns the name of the month of the given date.
 *
 * @param date The date of which to get the month.
 * @returns The name of the month
 */
export const getMonthString = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Creates a firebase timestamp from a given date.
 *
 * @param date The date to create the timestamp from
 * @returns The timestamp created from the date
 */
/*
export const getTimestamp = (date: Date): firebase.firestore.Timestamp => {
  return firebase.firestore.Timestamp.fromDate(date);
};
*/

/**
 * @returns An array of string containing all the hour marks of a day.
 */
export const getTimeSlots = (): Array<string> => {
  const hours = [];
  for (let i = 0; i < 25; i++) {
    hours.push(
      i.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) + ':00'
    );
  }
  return hours;
};

export const getWeekdays = (
  format: 'long' | 'short' = 'short'
): Array<string> => {
  const f = Intl.DateTimeFormat('en-US', {
    weekday: format,
  });
  const current = new Date();
  let week = [];
  // Starting Monday not Sunday
  let first = current.getDate() - current.getDay() + 1;
  for (var i = 0; i < 7; i++) {
    week.push(f.format(new Date(current.setDate(first++))));
  }
  return week;
};

export const weekdays = getWeekdays('long');

/**
 * Creates a firebase timestamp from a given date.
 *
 * @param date The date to create the timestamp from
 * @returns The timestamp created from the date
 */
export const getTimestamp = (date: Date): firebase.firestore.Timestamp => {
  return firebase.firestore.Timestamp.fromDate(date);
};
