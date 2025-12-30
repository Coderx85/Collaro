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
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

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

export const UserRole = pgUserRole.enumValues;
export const MeetingStatus = pgMeetingStatus.enumValues;
export const ParticipantStatus = pgParticipantStatus.enumValues;

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
  ]
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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    t
      .uniqueIndex("members_user_workspace_unique_idx")
      .on(table.userId, table.workspaceId),
    t.index("members_workspace_id_idx").on(table.workspaceId),
    t.index("members_role_idx").on(table.role),
  ]
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
    status: pgMeetingStatus().notNull().default("scheduled"),
    description: text("description").default("Instant Meeting"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    endAt: timestamp("end_at"),
  },
  (table) => [
    t.index("workspace_meetings_workspace_id_idx").on(table.workspaceId),
    t.index("workspace_meetings_hosted_by_idx").on(table.hostedBy),
  ]
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
  ]
);

export const CreateUserSchema = createInsertSchema(usersTable, {
  password: z.string().min(6),
  userName: z.string().min(6, "User Name is required"),
  name: z.string().min(6, "Name is required"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is required"),
})
  .extend({
    confirmPassword: z.string().min(6, "Must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .omit({
    createdAt: true,
    updatedAt: true,
    emailVerified: true,
    id: true,
  });

export const CreateWorkspaceSchema = createInsertSchema(workspacesTable);

export const UpdateWorkspaceSchema = createUpdateSchema(workspacesTable, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  logo: z.string().url("Logo must be a valid URL").optional(),
  updatedAt: z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
});

export const SelectUserSchema = createSelectSchema(usersTable, {
  password: z.string().min(6),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});

export const SelectCallSchema = createSelectSchema(workspaceMeetingTable);

export const SelectCallMember = createSelectSchema(membersTable);

export const UpdateMeetingSchema = createUpdateSchema(workspaceMeetingTable, {
  status: z.enum(MeetingStatus),
  endAt: z.date(),
}).omit({
  meetingId: true,
  workspaceId: true,
  hostedBy: true,
  createdAt: true,
});

export type CreateMeetingType = typeof workspaceMeetingTable.$inferInsert;
export type CreateWorkspaceType = typeof workspacesTable.$inferInsert;
export type CreateMemberType = typeof membersTable.$inferInsert;
export type CreateUserType = typeof usersTable.$inferInsert;
export type CreateParticipantType =
  typeof meetingParticipantsTable.$inferInsert;

export type SelectMemberType = typeof membersTable.$inferSelect;
export type SelectMeetingType = typeof workspaceMeetingTable.$inferSelect;
export type SelectWorkspaceType = typeof workspacesTable.$inferSelect;
export type SelectUserType = typeof usersTable.$inferSelect;
export type SelectParticipantType =
  typeof meetingParticipantsTable.$inferSelect;
