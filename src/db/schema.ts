import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

// Define role enum first
export const roleEnum = pgEnum("role", ["admin", "member"]);

// Users table definition
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userName: text("user_name").notNull().unique(),
  clerkId: varchar("clerkId", { length: 256 }).notNull().unique(),
  email: text("email").notNull().unique(),
  workspaceId: uuid("workspace_id").references(
    (): any => workspacesTable.id
  ),
  role: roleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Workspaces table definition
export const workspacesTable = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdBy: text("created_by")
    .references(() => usersTable.userName, {
      onDelete: "set null",
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Workspace users junction table
export const workspaceUsersTable = pgTable("workspace_users", {
  userName: text("user_name")
    .notNull()
    .references(() => usersTable.userName, {
      onDelete: "cascade",
    }),
  workspaceName: text("workspace_name")
    .notNull()
    .references(() => workspacesTable.name, {
      onDelete: "cascade",
    }),
  role: roleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Workspace meetings table
export const workspaceMeetingTable = pgTable("workspace_meetings", {
  meetingId: uuid("meeting_id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, {
      onDelete: "cascade",
    }),
  hostedBy: text("hosted_by")
  .notNull()
    .references(() => usersTable.userName, {
      onDelete: "set null",
    }),
  description: text("description").default("Instant Meeting"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  endAt: timestamp("end_at"),
});

export type CreateMeetingType = typeof workspaceMeetingTable.$inferInsert;
export type CreateWorkspaceType = typeof workspacesTable.$inferInsert;
export type CreateUserType = typeof usersTable.$inferInsert;
export type SelectMeetingType = typeof workspaceMeetingTable.$inferSelect;
export type SelectWorkspaceType = typeof workspacesTable.$inferSelect;
export type SelectUserType = typeof usersTable.$inferSelect;