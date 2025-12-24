/**
 * Event context model
 */

export interface EventContext {
  eventName?: string;
  date?: Date;
  djPerformer?: string;
  specialNotes?: string;
}

export function hasEventInfo(context?: EventContext): boolean {
  if (!context) return false;
  return !!(
    context.eventName ||
    context.date ||
    context.djPerformer ||
    context.specialNotes
  );
}

export function formatDate(
  date: Date,
  formatStr: string = "EEEE, MMMM d"
): string {
  // Simple date formatter - for production, use date-fns or similar
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  return `${dayName}, ${monthName} ${dayNum}`;
}
