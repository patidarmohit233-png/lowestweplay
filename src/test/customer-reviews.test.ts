import { describe, expect, it } from "vitest";
import { customerReviewSchema } from "@/lib/customer-reviews";

describe("customer review input rules", () => {
  it("allows ratings from 1 through 5 and rejects values outside that range", () => {
    expect(customerReviewSchema.safeParse({ rating: 1, reviewText: "A helpful top-up review." }).success).toBe(true);
    expect(customerReviewSchema.safeParse({ rating: 5, reviewText: "A helpful top-up review." }).success).toBe(true);
    expect(customerReviewSchema.safeParse({ rating: 0, reviewText: "A helpful top-up review." }).success).toBe(false);
    expect(customerReviewSchema.safeParse({ rating: 6, reviewText: "A helpful top-up review." }).success).toBe(false);
  });

  it("requires review text to contain between 10 and 500 characters", () => {
    expect(customerReviewSchema.safeParse({ rating: 5, reviewText: "123456789" }).success).toBe(false);
    expect(customerReviewSchema.safeParse({ rating: 5, reviewText: "1234567890" }).success).toBe(true);
    expect(customerReviewSchema.safeParse({ rating: 5, reviewText: "a".repeat(500) }).success).toBe(true);
    expect(customerReviewSchema.safeParse({ rating: 5, reviewText: "a".repeat(501) }).success).toBe(false);
  });
});