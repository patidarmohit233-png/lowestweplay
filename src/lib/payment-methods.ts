export const UPI_APPS = ["PhonePe", "Google Pay", "Paytm"] as const;

export function paymentMethodLabel(value?: string | null): string {
  if (value === "razorpay" || value === "upi") return "UPI · Secure payment";
  return value ? value.replaceAll("_", " ") : "Payment";
}