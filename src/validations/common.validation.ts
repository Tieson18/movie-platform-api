import { z } from "zod";

export const IdParamsSchema = z.object({
  params: z.object({
    id: z.uuid("id must be a valid UUID"),
  }),
});
