const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Compact, uppercase label meant for the mono metadata style: TODAY, YESTERDAY, 3 SEP, 3 SEP 2025. */
export function formatRelativeDay(ts: number, now: number = Date.now()): string {
  const dayDiff = Math.round((startOfDay(now) - startOfDay(ts)) / 86_400_000);
  if (dayDiff === 0) return 'TODAY';
  if (dayDiff === 1) return 'YESTERDAY';
  const d = new Date(ts);
  const base = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return d.getFullYear() === new Date(now).getFullYear() ? base : `${base} ${d.getFullYear()}`;
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
