export const PAYMENT_METHODS = [
  {
    id: "google_play",
    label: "Google Play redeem code",
    shortLabel: "Google Play",
    instructions: "Buy an unused Google Play gift code for the exact amount shown. Do not redeem it yourself; paste the full code below.",
  },
  {
    id: "amazon_pay_egift",
    label: "Amazon Pay e-gift card",
    shortLabel: "Amazon Pay",
    instructions: "Buy an unused Amazon Pay e-gift card for the exact amount shown. Keep the voucher unredeemed and paste its code below.",
  },
  {
    id: "flipkart_egift",
    label: "Flipkart e-gift voucher",
    shortLabel: "Flipkart",
    instructions: "Buy an unused Flipkart e-gift voucher for the exact amount shown. Keep the voucher unredeemed and paste its code below.",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function isPaymentMethodId(value: string): value is PaymentMethodId {
  return PAYMENT_METHODS.some((method) => method.id === value);
}

export function paymentMethodLabel(value?: string | null): string {
  return PAYMENT_METHODS.find((method) => method.id === value)?.label ?? "Voucher code";
}