import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase, URL-safe, and can contain hyphens only",
    }),

  description: z
    .string()
    .max(500),

});

export type createProjectSchemaType = z.infer<typeof createProjectSchema>;
