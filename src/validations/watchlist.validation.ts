import { z } from "zod";

export const AddToWatchlistSchema = z.object({
  body: z.object({
    userId: z.uuid("userId must be a valid UUID"),
    movieId: z.uuid("movieId must be a valid UUID"),
  }),
});
