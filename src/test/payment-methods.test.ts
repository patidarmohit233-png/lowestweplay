import { describe, expect, it } from "vitest";
import { isPaymentMethodId, paymentMethodLabel, PAYMENT_METHODS } from "@/lib/payment-methods";

describe("checkout voucher options", () => {
  it("offers exactly Google Play, Amazon Pay and Flipkart e-gift options", () => {
    expect(PAYMENT_METHODS.map((method) => method.id)).toEqual([
      "google_play",
      "amazon_pay_egift",
      "flipkart_egift",
    ]);
  });

  it("accepts only supported voucher methods", () => {
    expect(isPaymentMethodId("google_play")).toBe(true);
    expect(isPaymentMethodId("amazon_pay_egift")).toBe(true);
    expect(isPaymentMethodId("flipkart_egift")).toBe(true);
    expect(isPaymentMethodId("upi")).toBe(false);
  });

  it("provides clear labels for admin and customer order details", () => {
    expect(paymentMethodLabel("amazon_pay_egift")).toBe("Amazon Pay e-gift card");
    expect(paymentMethodLabel("flipkart_egift")).toBe("Flipkart e-gift voucher");
  });

  it("gives each voucher a purchase, retrieve, and paste instruction", () => {
    for (const method of PAYMENT_METHODS) {
      expect(method.steps).toHaveLength(3);
      expect(method.steps[0]).toMatch(/exact amount/i);
      expect(method.steps[2]).toMatch(/paste/i);
    }
  });
});