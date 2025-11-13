export function formatRelativeTime(timestamp: string | number | Date, locale: string = 'bn'): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['week', 1000 * 60 * 60 * 24 * 7],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000]
  ];

  for (const [unit, ms] of units) {
    if (Math.abs(diff) > ms || unit === 'second') {
      const value = Math.round(diff / ms);
      const rtf = new Intl.RelativeTimeFormat(locale === 'bn' ? 'bn-BD' : 'en', { numeric: 'auto' });
      return rtf.format(value, unit);
    }
  }

  return '';
}


