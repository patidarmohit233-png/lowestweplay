import { describe, expect, it } from "vitest";
import { isRefundRestrictedPrice } from "@/lib/refunds";

describe("₹479 refund restriction", () => {
  it("blocks refunds for ₹479 orders only", () => {
    expect(isRefundRestrictedPrice(479)).toBe(true);
    expect(isRefundRestrictedPrice(1299)).toBe(false);
  });
});