import { describe, expect, it } from "vitest";
import { isValidAmazonPayVoucherPin } from "@/lib/payment-methods";

describe("Amazon Pay voucher PIN validation", () => {
  it("accepts exactly 14 numeric digits", () => {
    expect(isValidAmazonPayVoucherPin("12345678901234")).toBe(true);
  });

  it("rejects PINs shorter or longer than 14 digits", () => {
    expect(isValidAmazonPayVoucherPin("1234567890123")).toBe(false);
    expect(isValidAmazonPayVoucherPin("123456789012345")).toBe(false);
  });

  it("rejects non-numeric characters", () => {
    expect(isValidAmazonPayVoucherPin("1234567890123A")).toBe(false);
    expect(isValidAmazonPayVoucherPin("1234 5678 9012")).toBe(false);
  });
});