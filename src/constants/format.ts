export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftIsoDate(dayOffset: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  return toIsoDate(date);
}

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDisplayDate(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatMonthYear(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat('en-US').format(amount)} EGP`;
}

export function formatHourlyPrice(amount: number): string {
  return `${formatPrice(amount)}/hr`;
}

export function formatDuration(hours: number): string {
  return hours === 1 ? '1 hour' : `${hours} hours`;
}

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function addHours(time: string, hours: number): string {
  const total = toMinutes(time) + hours * 60;
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const nextHours = Math.floor(normalized / 60);
  const nextMinutes = normalized % 60;
  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
}

export function formatTimeRange(startTime: string, durationHours: number): string {
  return `${startTime} – ${addHours(startTime, durationHours)}`;
}

export function rangesOverlap(
  startA: string,
  durationA: number,
  startB: string,
  durationB: number,
): boolean {
  const a1 = toMinutes(startA);
  const a2 = a1 + durationA * 60;
  const b1 = toMinutes(startB);
  const b2 = b1 + durationB * 60;
  return a1 < b2 && b1 < a2;
}

export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(' ')[0] ?? fullName;
}

export function roundRating(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}
