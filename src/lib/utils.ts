import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-EU'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Booking statuses
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
    
    // Payment statuses
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-orange-100 text-orange-800',
    failed: 'bg-red-100 text-red-800',
    
    // General statuses
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    verified: 'bg-blue-100 text-blue-800',
    unverified: 'bg-yellow-100 text-yellow-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  bookedSlots: string[] = []
): string[] {
  const slots: string[] = [];
  const start = new Date(`2024-01-01 ${startTime}`);
  const end = new Date(`2024-01-01 ${endTime}`);
  
  while (start < end) {
    const timeString = start.toTimeString().slice(0, 5);
    if (!bookedSlots.includes(timeString)) {
      slots.push(timeString);
    }
    start.setMinutes(start.getMinutes() + duration);
  }
  
  return slots;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}