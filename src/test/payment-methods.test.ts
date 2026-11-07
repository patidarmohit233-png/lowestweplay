import { describe, expect, it } from "vitest";
import { paymentMethodLabel, UPI_APPS } from "@/lib/payment-methods";

describe("secure UPI checkout", () => {
	it("lists PhonePe, Google Pay and Paytm as supported UPI apps", () => {
		expect(UPI_APPS).toEqual(["PhonePe", "Google Pay", "Paytm"]);
	});

	it("labels UPI orders clearly for customers and admin", () => {
		expect(paymentMethodLabel("razorpay")).toBe("UPI · Secure payment");
		expect(paymentMethodLabel("upi")).toBe("UPI · Secure payment");
	});
});