import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Define user_role enum first
export const pgUserRole = pgEnum("user_role", ["admin", "member"]);

// Users table definition
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    userName: text("user_name").notNull().unique(),
    password: text("password").notNull(),
    emailVerified: boolean("email_verified").default(false),
    email: varchar("email", { length: 256 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    t.uniqueIndex("users_email_unique_idx").on(table.email),
    t.uniqueIndex("users_user_name_unique_idx").on(table.userName),
  ]
);

// Workspaces table definition
export const workspacesTable = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    createdBy: text("created_by").references(() => usersTable.userName, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    t.uniqueIndex("workspaces_name_unique_idx").on(table.name),
    t.uniqueIndex("workspaces_slug_unique_idx").on(table.slug),
  ]
);

// Members Table

export const membersTable = pgTable(
  "members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
      }),
    role: pgUserRole().notNull().default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    t
      .uniqueIndex("members_user_workspace_unique_idx")
      .on(table.userId, table.workspaceId),
    t.index("members_workspace_id_idx").on(table.workspaceId),
    t.index("members_role_idx").on(table.role),
  ]
);

// Workspace meetings table
export const workspaceMeetingTable = pgTable(
  "workspace_meetings",
  {
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
  },
  (table) => [
    t.index("workspace_meetings_workspace_id_idx").on(table.workspaceId),
    t.index("workspace_meetings_hosted_by_idx").on(table.hostedBy),
  ]
);

export const CreateUserSchema = createInsertSchema(usersTable);
export const CreateWorkspaceSchema = createInsertSchema(workspacesTable);
export const SelectUserSchema = createSelectSchema(usersTable);

export type CreateMeetingType = typeof workspaceMeetingTable.$inferInsert;
export type CreateWorkspaceType = typeof workspacesTable.$inferInsert;
export type CreateMemberType = typeof membersTable.$inferInsert;
export type CreateUserType = typeof usersTable.$inferInsert;
export type SelectMemberType = typeof membersTable.$inferSelect;
export type SelectMeetingType = typeof workspaceMeetingTable.$inferSelect;
export type SelectWorkspaceType = typeof workspacesTable.$inferSelect;
export type SelectUserType = typeof usersTable.$inferSelect;
