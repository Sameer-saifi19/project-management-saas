import { z } from "zod";

export const createOrgSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase, URL-safe, and can contain hyphens only",
    }),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description too long"),
});

export type createOrgSchemaType = z.infer<typeof createOrgSchema>;

export type updateOrgSchemaType = z.infer<typeof createOrgSchema>