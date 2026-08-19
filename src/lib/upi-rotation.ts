import { UPI_IDS } from './PaymentModal';

/**
 * Picks a UPI ID based on the current day of the week.
 * This ensures the UPI ID changes daily.
 */
export const getDailyUpiId = () => {
  if (!UPI_IDS || UPI_IDS.length === 0) return "";
  
  // Get current day of the year (0-365)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Use day of year to pick from the list
  return UPI_IDS[dayOfYear % UPI_IDS.length];
};
