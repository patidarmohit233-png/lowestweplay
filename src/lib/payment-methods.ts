export const AMAZON_PAY_EGIFT_METHOD = "amazon_pay_egift" as const;
export const AMAZON_PAY_EGIFT_LABEL = "Amazon Pay e-Gift Voucher";
export const AMAZON_PAY_VOUCHER_CODE_LENGTH = 14;

export function isValidAmazonPayVoucherPin(pin: string) {
  return /^[A-Za-z0-9]{14}$/.test(pin);
}

export function getPaymentMethodLabel(method?: string | null) {
  if (method === AMAZON_PAY_EGIFT_METHOD) return AMAZON_PAY_EGIFT_LABEL;
  if (method === "google_play") return "Google Play Redeem Code";
  if (method === "flipkart_egift") return "Flipkart e-Gift Voucher";
  return method || "Voucher payment";
}