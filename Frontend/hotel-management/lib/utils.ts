import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatCurrency(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('vi-VN');
}

export function parseCurrency(value: string): number {
  if (!value) return 0;
  // Remove all non-digit characters, then parse.
  const numericValue = value.replace(/\D/g, '');
  if (numericValue === '') return 0;
  return parseInt(numericValue, 10);
}

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
