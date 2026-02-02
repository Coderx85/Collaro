import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import * as t from "drizzle-orm/pg-core";

// Define user_role enum first
export const pgUserRole = pgEnum("user_role", ["owner", "admin", "member"]);
export const pgMeetingStatus = pgEnum("meeting_status", [
  "scheduled",
  "active",
  "completed",
]);

export const pgParticipantStatus = pgEnum("participant_status", [
  "invited",
  "joined",
  "left",
  "declined",
]);

// Users table definition
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    userName: text("user_name").notNull().unique(),
    password: text("password"),
    emailVerified: boolean("email_verified").default(false),
    email: varchar("email", { length: 256 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    t.uniqueIndex("users_email_unique_idx").on(table.email),
    t.uniqueIndex("users_user_name_unique_idx").on(table.userName),
  ],
);

// Workspaces table definition
export const workspacesTable = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    logo: text("logo").default(""),
    createdBy: text("created_by").references(() => usersTable.userName, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    t.uniqueIndex("workspaces_name_unique_idx").on(table.name),
    t.uniqueIndex("workspaces_slug_unique_idx").on(table.slug),
  ],
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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    t
      .uniqueIndex("members_user_workspace_unique_idx")
      .on(table.userId, table.workspaceId),
    t.index("members_workspace_id_idx").on(table.workspaceId),
    t.index("members_role_idx").on(table.role),
  ],
);

export const invitationTable = pgTable(
  "invitation",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
      }),
    email: text("email").notNull(),
    role: pgUserRole().notNull().default("member"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    t.index("invitation_workspace_id_idx").on(table.workspaceId),
    t.index("invitation_email_idx").on(table.email),
  ],
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
    status: pgMeetingStatus().notNull().default("scheduled"),
    description: text("description").default("Instant Meeting"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    endAt: timestamp("end_at"),
  },
  (table) => [
    t.index("workspace_meetings_workspace_id_idx").on(table.workspaceId),
    t.index("workspace_meetings_hosted_by_idx").on(table.hostedBy),
  ],
);

// Meeting participants table - tracks which members join which meetings
export const meetingParticipantsTable = pgTable(
  "meeting_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => workspaceMeetingTable.meetingId, {
        onDelete: "cascade",
      }),
    memberId: uuid("member_id")
      .notNull()
      .references(() => membersTable.id, {
        onDelete: "cascade",
      }),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    leftAt: timestamp("left_at"),
    status: pgParticipantStatus().notNull().default("invited"),
  },
  (table) => [
    t
      .uniqueIndex("meeting_participants_meeting_member_unique_idx")
      .on(table.meetingId, table.memberId),
    t.index("meeting_participants_meeting_id_idx").on(table.meetingId),
  ],
);
