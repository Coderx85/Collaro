import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "@/db/schema/auth-schema";
import { schema } from "@/db";
import { db } from "@/db/client";
import { nextCookies } from "better-auth/next-js";
import { config } from "../config";
import { organization } from "better-auth/plugins";
import { TUserId } from "@/types";
import { meetingPlugin } from "./meeting-plugin";
// import { ac, roles } from "./permission";

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
      meeting: schema.workspaceMeetingTable,
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
    meetingPlugin(),
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      schema: {
        organization: {
          modelName: "workspace",
          schema: schema.workspacesTable,
          additionalFields: {
            createdBy: {
              type: "string",
              required: true,
              input: true,
              transform: {
                output: (value) => value as unknown as TUserId,
              }
            },
          }
        },
        member: {
          modelName: "member",
          schema: schema.membersTable,
          fields: {
            organizationId: "workspaceId",
          },
          additionalFields: {
            name: {
              type: "string",
              required: true,
              input: true,
            },
          }
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
    hooks: {
      member: {
        after: async (ctx: { adapter: any }, members: any[]) => {
          const extendedMembers = await Promise.all(
            members.map(async (member) => {
              const user = await ctx.adapter.findUnique({
                model: 'user',
                where: { id: member.userId }
              });
              return {
                ...member,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  userName: user?.userName,
                  createdAt: user.createdAt,
                },
              };
            })
          );
          return extendedMembers;
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

// Permission helper functions (server-side versions)
export function canRoleDeleteOrganization(
  role: "owner" | "admin" | "member" | undefined,
): boolean {
  const validRoles = ["owner", "admin", "member"];
  if (!role || !validRoles.includes(role)) return false;
  // Only owner can delete
  return role === "owner";
}

export function canRoleUpdateOrganization(
  role: "owner" | "admin" | "member" | undefined,
): boolean {
  const validRoles = ["owner", "admin", "member"];
  if (!role || !validRoles.includes(role)) return false;
  // Owner and admin can update
  return role === "owner" || role === "admin";
}
