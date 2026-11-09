import { describe, expect, it } from "vitest";
import { isValidAmazonPayVoucherCode } from "@/lib/payment-methods";

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
});