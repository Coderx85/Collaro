import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  serial,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

// Define role enum first
export const roleEnum = pgEnum("role", ["owner", "admin", "member"]);

// Users table definition
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userName: text("user_name").notNull().unique(),
  clerkId: varchar("clerkId", { length: 256 }).notNull().unique(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").notNull().default("member"),
  workspaceId: uuid("workspace_id").references(() => workspacesTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Workspaces table definition
export const workspacesTable = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdBy: uuid("created_by")
    .notNull()
    .references((): any => usersTable.id, {
      onDelete: "set null",
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Workspace users junction table
export const workspaceUsersTable = pgTable("workspace_users", {
  userId: uuid("user_id")
    .notNull()
    .primaryKey()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  workspaceName: text("workspace_name")
    .notNull()
    .references(() => workspacesTable.name, {
      onDelete: "cascade",
    }),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, {
      onDelete: "cascade",
    }),
  role: roleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Workspace meetings table
export const workspaceMeetingTable = pgTable("workspace_meetings", {
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, {
      onDelete: "cascade",
    }),
  workspacName: text("workspace_name")
    .notNull()
    .references(() => workspacesTable.name, {
      onDelete: "cascade",
    }),
  title: text("name").notNull(),
  description: text("description").default("Instant Meeting"),
  hostedBy: uuid("hosted_by")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "set null",
    }),
  meetingId: uuid("meeting_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),
});

// Notifications table
export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  meetingId: text("meeting_id"),
  workspaceId: text("workspace_id"),
  scheduledFor: timestamp("scheduled_for"),
  isRead: boolean("is_read").default(false),
  type: text("type").notNull().default("meeting"), // 'meeting', 'direct_call', etc.
  createdAt: timestamp("created_at").defaultNow(),
});
