import { TimeLeft } from '../components/types';

export function isBirthdayDate(): boolean {

  const birthdayStart = new Date('2026-02-28T00:00:00+05:30');
  // Get current date and time in Indian timezone
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const indianDateTime = now.toLocaleString('en-IN', options);
  // Format: "28/02/2026, 00:00"
  const [datePart, timePart] = indianDateTime.split(', ');
  const [day, month, year] = datePart.split('/');

  // Create current date in IST
  const currentIST = new Date(`${year}-${month}-${day}T${timePart}:00+05:30`);


  return currentIST >= birthdayStart;
}

export function getTimeUntilBirthday(): TimeLeft {
  // Birthday starts at February 28, 2026 00:00 IST
  const birthdayStart = new Date('2026-02-28T00:00:00+05:30');

  // Get current time
  const now = new Date();

  const difference = birthdayStart.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000)
  };
}