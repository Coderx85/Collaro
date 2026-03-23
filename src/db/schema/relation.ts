import { relations } from "drizzle-orm";
import * as schema from "./schema";

export const usersRelations = relations(schema.usersTable, ({ many }) => ({
  members: many(schema.membersTable),
  joinRequests: many(schema.joinRequestsTable),
}));

export const workspacesRelations = relations(schema.workspacesTable, ({ one, many }) => ({
  owner: one(schema.usersTable, {
    fields: [schema.workspacesTable.createdBy],
    references: [schema.usersTable.userName],
  }),
  members: many(schema.membersTable),
  meetings: many(schema.workspaceMeetingTable),
  joinRequests: many(schema.joinRequestsTable),
}));

export const joinRequestsRelations = relations(
  schema.joinRequestsTable,
  ({ one }) => ({
    workspace: one(schema.workspacesTable, {
      fields: [schema.joinRequestsTable.workspaceId],
      references: [schema.workspacesTable.id],
    }),
    user: one(schema.usersTable, {
      fields: [schema.joinRequestsTable.userId],
      references: [schema.usersTable.id],
    }),
  })
);