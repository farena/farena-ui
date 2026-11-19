const pad = (value: number) => String(value).padStart(2, "0");

const DATE_FORMATS = [
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})(?: (?<hour>\d{1,2}):(?<minute>\d{2}))?$/,
  /^(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})(?: (?<hour>\d{1,2}):(?<minute>\d{2}))?$/,
];

export function parseDate(
  value: string | Date | null | undefined,
  isDateTime = false,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return isDateTime ? new Date(value) : startOfDay(value);
  }

  const groups = DATE_FORMATS.map((pattern) => pattern.exec(value.trim())).find(Boolean)?.groups;
  if (!groups) return null;

  const year = Number(groups.year);
  const month = Number(groups.month);
  const day = Number(groups.day);
  const hour = isDateTime && groups.hour ? Number(groups.hour) : 0;
  const minute = isDateTime && groups.minute ? Number(groups.minute) : 0;
  if (hour > 23 || minute > 59) return null;

  const date = new Date(year, month - 1, day, hour, minute);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export function addMonths(date: Date, months: number): Date {
  const target = new Date(date);
  target.setDate(1);
  target.setMonth(target.getMonth() + months);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0);
  target.setDate(Math.min(date.getDate(), lastDay.getDate()));
  return target;
}

export const toYmd = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toDmy = (date: Date): string =>
  `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

export const toHm = (date: Date): string => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function parseToString(date: Date | null, isDateTime = false): string | null {
  if (!date) return null;
  return isDateTime ? `${toYmd(date)} ${toHm(date)}` : toYmd(date);
}
