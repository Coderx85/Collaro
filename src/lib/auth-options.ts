import { BetterAuthOptions } from "better-auth";

export const betterOpts = {
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: true,
      },
      userName: {
        type: "string",
        required: true,
        unique: true,
      },
    }
  }
} as const satisfies BetterAuthOptions;

export type AuthOptions = typeof betterOpts;