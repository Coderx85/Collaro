import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(7),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().url(),
    NEXT_PUBLIC_STREAM_API_KEY: z.string().min(10),
    NEXT_PUBLIC_RESEND_API_KEY: z.string().min(10),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    NEXT_PUBLIC_RESEND_API_KEY: process.env.NEXT_PUBLIC_RESEND_API_KEY,
  }
})