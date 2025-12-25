import { CreateUserSchema, CreateWorkspaceSchema } from "@/db/schema/schema";
import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z
    .string()
    .max(160, { message: "Bio cannot be longer than 160 characters." })
    .optional(),
  url: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
});

export const registerSchema = CreateUserSchema;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const NewWorkspaceFormSchema = CreateWorkspaceSchema.pick({
  name: true,
  slug: true,
  logo: true,
});
