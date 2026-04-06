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

export const membersRelations = relations(
  schema.membersTable, ({ one, many }) => ({
    workspace: 
      one(schema.workspacesTable, {
        fields: [schema.membersTable.workspaceId],
        references: [schema.workspacesTable.id],
      }),
    user: one(schema.usersTable, {
      fields: [schema.membersTable.userId],
      references: [schema.usersTable.id],
    }),
    notifications: many(schema.notificationsTable),
  })
);

export const privateMeetingsRelations = relations(
  schema.privateMeetingsTable, ({ one }) => ({
    host: one(schema.usersTable, {
      fields: [schema.privateMeetingsTable.hostedBy],
      references: [schema.usersTable.userName],
    }),
  })
);

export const workspaceMeetingRelations = relations(
  schema.workspaceMeetingTable, ({ one, many }) => ({
    workspace: one(schema.workspacesTable, {
      fields: [schema.workspaceMeetingTable.workspaceId],
      references: [schema.workspacesTable.id],
    }),
    participants: many(schema.meetingParticipantsTable),
  }),
);

export const participantsRelations = relations(
  schema.meetingParticipantsTable, ({ one, many }) => ({
    meeting: one(schema.workspaceMeetingTable, {
      fields: [schema.meetingParticipantsTable.meetingId],
      references: [schema.workspaceMeetingTable.meetingId],
    }),
  })
);

export const notificationsRelations = relations(
  schema.notificationsTable, ({ one }) => ({
    member: one(schema.membersTable, {
      fields: [schema.notificationsTable.memberId],
      references: [schema.membersTable.id],
    }),
    user: one(schema.usersTable, {
      fields: [schema.notificationsTable.userId],
      references: [schema.usersTable.id],
    }),
    workspace: one(schema.workspacesTable, {
      fields: [schema.notificationsTable.workspaceId],
      references: [schema.workspacesTable.id],
    }),
  })
);