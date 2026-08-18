import { Currency, Product } from '../types';

export const EXCHANGE_RATES: Record<Currency, number> = {
  PKR: 1,
  USD: 1 / 280,
  EUR: 1 / 305,
  GBP: 1 / 355,
  AED: 1 / 76.2,
  SAR: 1 / 74.5,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  PKR: '₨',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SAR: 'SAR ',
};

/**
 * Converts PKR base amount to selected currency and formats it cleanly
 */
export function formatCurrency(amountPKR: number, currency: Currency = 'PKR'): string {
  const rate = EXCHANGE_RATES[currency] || 1;
  const converted = amountPKR * rate;
  const symbol = CURRENCY_SYMBOLS[currency] || '₨';

  if (currency === 'PKR' || currency === 'AED' || currency === 'SAR') {
    return `${symbol} ${Math.round(converted).toLocaleString('en-US')}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
}

export function formatPKR(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString('en-US')}`;
}

export function calculateDiscount(price: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function generateLicenseKey(prefix = 'PB'): string {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${segment()}-${segment()}-${segment()}-${segment()}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PB-${timestamp}-${rand}`;
}
