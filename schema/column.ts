import {z} from 'zod'

export const createColumnSchema = z.object({
    name: z.string("name is required")
})

export type createColumnSchemaType = z.infer<typeof createColumnSchema>