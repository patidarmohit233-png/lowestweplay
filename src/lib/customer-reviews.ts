import { z } from "zod";

export const customerReviewSchema = z.object({
  rating: z.number().int().min(1, "Choose at least one star.").max(5, "Rating cannot exceed five stars."),
  reviewText: z.string().trim().min(10, "Write at least 10 characters.").max(500, "Keep your review under 500 characters."),
});

export type CustomerReviewInput = z.infer<typeof customerReviewSchema>;
