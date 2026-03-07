import z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, "Name is required").max(100),
  slug: z.string(),
});

export type createWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>;
