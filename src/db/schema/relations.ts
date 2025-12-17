import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  pgRoles,
  workspaceMeetingTable,
  workspacesTable,
  usersTable,
} from "./schema";
import * as t from "drizzle-orm/pg-core";

// Join table linking workspace meetings <-> users (attendees)
export const workspaceMeetingAttendeesTable = pgTable(
  "workspace_meeting_attendees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => workspaceMeetingTable.meetingId, {
        onDelete: "cascade",
      }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    role: pgRoles("role").notNull().default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    // Prevent duplicate attendee rows for the same meeting + user
    t
      .uniqueIndex("wma_meeting_user_unique_idx")
      .on(table.meetingId, table.userId),
    // Helpful indexes for lookups by workspace / user
    t.index("wma_workspace_idx").on(table.workspaceId),
    t.index("wma_user_idx").on(table.userId),
  ],
);

export const workspaceUserTable = pgTable(
  "workspace_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    role: pgRoles("role").notNull().default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    t
      .uniqueIndex("workspace_users_workspace_user_unique_idx")
      .on(table.workspaceId, table.userId),
  ],
);

export type CreateWorkspaceUser = typeof workspaceUserTable.$inferInsert;
export type SelectWorkspaceUser = typeof workspaceUserTable.$inferSelect;

export type CreateWorkspaceMeetingAttendee =
  typeof workspaceMeetingAttendeesTable.$inferInsert;
export type SelectWorkspaceMeetingAttendee =
  typeof workspaceMeetingAttendeesTable.$inferSelect;
