import { z } from "zod";

const MovieBodySchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  director: z.string().trim().min(1, "director is required"),
  releaseYear: z.number().int().nullable().optional(),
  genre: z.string().trim().min(1, "genre is required"),
  rating: z.number().min(0, "rating must be between 0 and 10").max(10, "rating must be between 0 and 10"),
});

export const CreateMovieSchema = z.object({
  body: MovieBodySchema,
});

export const UpdateMovieSchema = z.object({
  body: MovieBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "at least one field must be provided",
  }),
});
