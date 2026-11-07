export const PAYMENT_METHODS = [
  {
    id: "google_play",
    label: "Google Play redeem code",
    shortLabel: "Google Play Redeem Code",
    steps: [
      "Buy a Google Play gift card from an official or authorized seller for the exact amount shown above.",
      "Get the code from the card or the seller's order email. Do not redeem it in your own Google account.",
      "Paste the complete code here and tap Verify Payment.",
    ],
  },
  {
    id: "amazon_pay_egift",
    label: "Amazon Pay e-gift card",
    shortLabel: "Amazon Pay e-voucher",
    steps: [
      "In Amazon, open Gift Cards and choose an Amazon Pay e-gift card for the exact amount shown above.",
      "Complete the purchase, then find the voucher code in your order or delivery email. Do not add it to your own account.",
      "Paste the complete voucher code here and tap Verify Payment.",
    ],
  },
  {
    id: "flipkart_egift",
    label: "Flipkart e-gift voucher",
    shortLabel: "Flipkart e-voucher",
    steps: [
      "In Flipkart, open Gift Cards and choose an e-gift voucher for the exact amount shown above.",
      "Complete the purchase, then retrieve the voucher code from your order or delivery email. Do not add it to your own account.",
      "Paste the complete voucher code here and tap Verify Payment.",
    ],
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function isPaymentMethodId(value: string): value is PaymentMethodId {
  return PAYMENT_METHODS.some((method) => method.id === value);
}

export function paymentMethodLabel(value?: string | null): string {
  return PAYMENT_METHODS.find((method) => method.id === value)?.label ?? "Voucher code";
}