import { describe, expect, it } from "vitest";
import { isRefundRestrictedOrder } from "@/lib/refunds";

describe("₹479 refund restriction", () => {
  it("blocks refunds for either ₹479 plan, including quantity orders", () => {
    expect(isRefundRestrictedOrder(479, "10K RED PACKET")).toBe(true);
    expect(isRefundRestrictedOrder(958, "10K RED PACKET")).toBe(true);
    expect(isRefundRestrictedOrder(958, "10K GOLD")).toBe(true);
    expect(isRefundRestrictedOrder(1299, "50K RED PACKET")).toBe(false);
  });
});