import dayjs from 'dayjs';

/** Locale and currency used for every number on the dashboard. */
export const LOCALE = 'en-US';
export const CURRENCY = 'USD';

export const money = (n: number, decimals = 0) =>
  n.toLocaleString(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export const num = (n: number) => n.toLocaleString(LOCALE);

export const pct = (n: number) => `${n}%`;

export const date = (d: string) => dayjs(d).format('D MMM YYYY');

export const dateTime = (d: string) => dayjs(d).format('D MMM YYYY, h:mm A');
