export const AMAZON_PAY_EGIFT_METHOD = "amazon_pay_egift" as const;
export const AMAZON_PAY_EGIFT_LABEL = "Amazon Pay e-Gift Voucher";
export const AMAZON_PAY_VOUCHER_CODE_LENGTH = 14;

export function normalizeAmazonPayVoucherCode(value: string) {
  return value.replace(/[^A-Za-z0-9]/g, "").slice(0, AMAZON_PAY_VOUCHER_CODE_LENGTH);
}

export function extractAmazonPayVoucherCode(value: string) {
  const codeLabel = /\b(?:(?:amazon\s*pay\s*)?(?:e-?\s*)?gift\s*card|voucher|claim|redemption|redeem|code)\s*(?:code|number|no\.?)?\s*(?:is\s*)?[:#-]?\s*/i;
  const labelMatch = codeLabel.exec(value);
  let source = labelMatch ? value.slice(labelMatch.index + labelMatch[0].length) : value;

  const pinLabel = /\b(?:security\s+pin|card\s+pin|pin)\b/i;
  const pinMatch = pinLabel.exec(source);
  if (pinMatch) source = source.slice(0, pinMatch.index);

  const groups = source.match(/[A-Za-z0-9]+/g) ?? [];
  for (let start = 0; start < groups.length; start += 1) {
    let candidate = "";
    for (let index = start; index < groups.length; index += 1) {
      const next = groups[index];
      if (!next || candidate.length + next.length > AMAZON_PAY_VOUCHER_CODE_LENGTH) break;
      candidate += next;
      if (candidate.length === AMAZON_PAY_VOUCHER_CODE_LENGTH) return candidate;
    }
  }

  return normalizeAmazonPayVoucherCode(source);
}

export function isValidAmazonPayVoucherCode(code: string) {
  return /^[A-Za-z0-9]{14}$/.test(code);
}

export function getPaymentMethodLabel(method?: string | null) {
  if (method === AMAZON_PAY_EGIFT_METHOD) return AMAZON_PAY_EGIFT_LABEL;
  if (method === "google_play") return "Google Play Redeem Code";
  if (method === "flipkart_egift") return "Flipkart e-Gift Voucher";
  return method || "Voucher payment";
}