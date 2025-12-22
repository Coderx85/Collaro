import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "@/db/schema/auth-schema";
import { schema } from "@/db";
import { db } from "@/db/client";
import { nextCookies } from "better-auth/next-js";
import { config } from "./config";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  secret: config.betterSecret,
  baseURL: config.betterAuthUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.usersTable,
      session: authSchema.session,
      account: authSchema.account,
      verification: authSchema.verification,
      workspace: schema.workspacesTable,
      member: schema.membersTable,
      invitation: schema.invitationTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day - update session if older than this
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    nextCookies(),
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      schema: {
        organization: {
          modelName: "workspace",
          schema: schema.workspacesTable,
        },
        member: {
          modelName: "member",
          schema: schema.membersTable,
          fields: {
            organizationId: "workspaceId",
          },
        },
        invitation: {
          modelName: "invitation",
          schema: schema.invitationTable,
          fields: {
            organizationId: "workspaceId",
        },
        },
      },
    }),
  ],
  user: {
    additionalFields: {
      userName: {
        type: "string",
        required: false,
        unique: true,
        input: true,
      },
    },
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
