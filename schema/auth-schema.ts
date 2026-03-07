import * as z from "zod";

export const signupSchema = z.object({
  name: z
    .string("required *")
    .min(3, "name should be atleast 3 characters")
    .max(50),
  email: z.email("required *"),
  password: z
    .string("password cannot be empty")
    .min(8, "password must be atleast 8 characters")
    .max(50),
});
export type signupSchemaType = z.infer<typeof signupSchema>;



export const signinSchema = z.object({
  email: z.email("required *"),
  password: z
    .string("password cannot be empty")
    .min(8, "password must be atleast 8 characters")
    .max(50),
});
export type signinSchemaType = z.infer<typeof signinSchema>;