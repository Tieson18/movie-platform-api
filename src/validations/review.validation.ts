import { z } from "zod";

export const CreateReviewSchema = z.object({
  body: z.object({
    userId: z.uuid("userId must be a valid UUID"),
    movieId: z.uuid("movieId must be a valid UUID"),
    rating: z.number().min(0, "rating must be between 0 and 10").max(10, "rating must be between 0 and 10"),
    comment: z.string().trim().max(2000).nullable().optional(),
  }),
});
