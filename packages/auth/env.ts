import { createEnv } from "@t3-oss/env-nextjs"
import z from "zod"

export const env = createEnv({
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().url()
  }
})