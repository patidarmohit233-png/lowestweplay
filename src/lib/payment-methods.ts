export const PAYMENT_METHODS = [
  {
    id: "google_play",
    label: "Google Play redeem code",
    shortLabel: "Google Play",
    instructions: "Buy a Google Play gift code for the exact amount shown. Do not redeem it in your own account. Copy the full code and paste it below for the team to review.",
  },
  {
    id: "amazon_pay_egift",
    label: "Amazon Pay e-gift card",
    shortLabel: "Amazon Pay",
    instructions: "Buy an Amazon Pay e-gift card for the exact amount shown. Do not add it to your own account. Copy the full voucher code and paste it below for the team to review.",
  },
  {
    id: "flipkart_egift",
    label: "Flipkart e-gift voucher",
    shortLabel: "Flipkart",
    instructions: "Buy a Flipkart e-gift voucher for the exact amount shown. Do not add it to your own account. Copy the full code and paste it below for the team to review.",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function isPaymentMethodId(value: string): value is PaymentMethodId {
  return PAYMENT_METHODS.some((method) => method.id === value);
}

export function paymentMethodLabel(value?: string | null): string {
  return PAYMENT_METHODS.find((method) => method.id === value)?.label ?? "Voucher code";
}