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
import { TMeetingId, TParticipantId, TWorkspaceId } from "@/modules/meeting";
import { TMemberId } from "@/modules/member";
import { TUserId } from "@/modules/user";

// Define user_role enum first
export const pgUserRole = pgEnum("user_role", ["owner", "admin", "member"]);

export const pgMeetingStatus = pgEnum("meeting_status", [
  "scheduled",
  "active",
  "completed",
  "cancelled",
]);

export const pgJoinRequestStatus = pgEnum("join_request_status", [
  "pending",
  "approved",
  "rejected",
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
    id: uuid("id").defaultRandom().primaryKey().$type<TUserId>(),
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
    id: uuid("id").defaultRandom().primaryKey().$type<TWorkspaceId>(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    logo: text("logo").default(""),
    createdBy: uuid("created_by").references(() => usersTable.id, {
      onDelete: "set null",
    }).$type<TUserId>(),
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
    id: uuid("id").defaultRandom().primaryKey().$type<TMemberId>(),
    name: text("name").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }).$type<TUserId>(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
      }).$type<TWorkspaceId>(),
    role: pgUserRole().notNull().default("member"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
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
      }).$type<TWorkspaceId>(),
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
    meetingId: uuid("meeting_id").$type<TMeetingId>().defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .$type<TWorkspaceId>()  
      .notNull()
      .references(() => workspacesTable.id, {
        onDelete: "cascade",
      }),
    hostedBy: uuid("hosted_by")
      .$type<TMemberId>()
      .notNull()
      .references(() => membersTable.id, {
        onDelete: "set null",
      }),
    status: pgMeetingStatus().notNull().default("active"),
    description: text("description").default("Instant Meeting"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    endAt: timestamp("end_at"),
  },
  (table) => [
    t.index("workspace_meetings_workspace_id_idx").on(table.workspaceId),
    t.index("workspace_meetings_hosted_by_idx").on(table.hostedBy),
  ],
);

export const privateMeetingsTable = pgTable(
  "private_meetings",
  {
    meetingId: uuid("meeting_id").$type<TMeetingId>().defaultRandom().primaryKey(),
    hostedBy: uuid("hosted_by").$type<TUserId>().notNull().references(() => usersTable.id, {
      onDelete: "set null",
    }),
    status: pgMeetingStatus().notNull().default("scheduled"),
    description: text("description").default("Instant Meeting"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    endAt: timestamp("end_at"),
  },
  (table) => [
    t
      .uniqueIndex("private_meetings_hosted_by_unique_idx")
      .on(table.hostedBy),
    t.index("private_meetings_hosted_by_idx").on(table.hostedBy),
  ]
)

// Meeting participants table - tracks which members join which meetings
export const meetingParticipantsTable = pgTable(
  "meeting_participants",
  {
    id: uuid("id").defaultRandom().primaryKey().$type<TParticipantId>(),
    name: text("name").notNull(),
    meetingId: uuid("meeting_id")
      .$type<TMeetingId>()
      .notNull()
      .references(() => workspaceMeetingTable.meetingId, {
        onDelete: "cascade",
      }),
    memberId: uuid("member_id")
      .$type<TMemberId>()
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

// Join Requests table - tracks workspace join requests
export const joinRequestsTable = pgTable(
  "join_requests",
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
    status: pgJoinRequestStatus("status").default("pending").notNull(),
    requestedAt: timestamp("requested_at").notNull().defaultNow(),
    respondedAt: timestamp("responded_at"),
    respondedBy: uuid("responded_by").references(() => usersTable.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    t
      .uniqueIndex("join_requests_user_workspace_pending_unique_idx")
      .on(table.userId, table.workspaceId, table.status)
      .where(sql`status = 'pending'`),
    t.index("join_requests_workspace_id_idx").on(table.workspaceId),
    t.index("join_requests_status_idx").on(table.status),
    t.index("join_requests_user_id_idx").on(table.userId),
  ],
);

const notificationTypes = ["join_request", "meeting_invite", "general"] as const;

export const pgNotificationType = pgEnum("notification_type", notificationTypes);

export const notificationsTable = pgTable("notifications", {
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
  memberId: uuid("member_id")
    .notNull()
    .references(() => membersTable.id, {
      onDelete: "cascade",
    }),
  type: pgNotificationType("notification_type").default("general").notNull(),
  message: text("message").notNull(),
  read: boolean("read_status").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  readAt: timestamp("read_at"),
  }, 
  (table) => [
    t.index("notifications_user_id_idx").on(table.userId),
    t.index("notifications_workspace_id_idx").on(table.workspaceId),
    t.index("notifications_member_id_idx").on(table.memberId),
    t.index("notifications_read_status_idx").on(table.read),
  ]
);