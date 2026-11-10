import { describe, expect, it } from "vitest";
import { extractAmazonPayVoucherCode, isValidAmazonPayVoucherCode, normalizeAmazonPayVoucherCode } from "@/lib/payment-methods";

describe("Amazon Pay voucher code validation", () => {
  it("accepts exactly 14 letters and/or digits", () => {
    expect(isValidAmazonPayVoucherCode("12345678901234")).toBe(true);
    expect(isValidAmazonPayVoucherCode("TQ4H3BJ43RTEXY")).toBe(true);
    expect(isValidAmazonPayVoucherCode("AbC123xYz45678")).toBe(true);
  });

  it("rejects codes shorter or longer than 14 characters", () => {
    expect(isValidAmazonPayVoucherCode("AbC123xYz4567")).toBe(false);
    expect(isValidAmazonPayVoucherCode("AbC123xYz456789")).toBe(false);
  });

  it("rejects spaces and non-alphanumeric characters", () => {
    expect(isValidAmazonPayVoucherCode("1234 5678 9012")).toBe(false);
    expect(isValidAmazonPayVoucherCode("1234567890123@")).toBe(false);
  });

  it("normalizes pasted codes with hyphens, then accepts them", () => {
    const code = normalizeAmazonPayVoucherCode("TQ4H-3BJ43R-TEXY");
    expect(code).toBe("TQ4H3BJ43RTEXY");
    expect(isValidAmazonPayVoucherCode(code)).toBe(true);
  });

  it("keeps an unformatted 14-character pasted code unchanged", () => {
    const code = normalizeAmazonPayVoucherCode("TQ4H3BJ43RTEXT");
    expect(code).toBe("TQ4H3BJ43RTEXT");
    expect(isValidAmazonPayVoucherCode(code)).toBe(true);
  });

  it("removes whitespace and caps normalized input at 14 characters", () => {
    expect(normalizeAmazonPayVoucherCode("  TQ4H 3BJ43R TEXY  ")).toBe("TQ4H3BJ43RTEXY");
    expect(normalizeAmazonPayVoucherCode("TQ4H3BJ43RTEXT9")).toBe("TQ4H3BJ43RTEXT");
  });

  it("extracts the voucher code from pasted details and ignores a labeled PIN", () => {
    const code = extractAmazonPayVoucherCode("Amazon Pay Gift Card Code: TQ4H-3BJ43R-TEXY\nPIN: 1234");
    expect(code).toBe("TQ4H3BJ43RTEXY");
    expect(isValidAmazonPayVoucherCode(code)).toBe(true);
  });

  it("extracts a plain code from labeled, multi-line voucher details", () => {
    expect(extractAmazonPayVoucherCode("Voucher Code\nAbC123xYz45678\nPIN: 9876")).toBe("AbC123xYz45678");
  });
});