import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  serial,
  boolean,
  integer,
  numeric,
  jsonb,
  // PgArray,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

// export const members = PgArray()

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
  // members: PgArray(""),
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

// Subscription plan status enum
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "authenticated",
  "pending",
  "halted",
  "cancelled",
  "completed",
  "expired",
]);

// Subscription plans table
export const subscriptionPlansTable = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  razorpayPlanId: text("razorpay_plan_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(), // Amount in INR
  interval: text("interval").notNull().default("monthly"), // monthly, yearly, etc.
  intervalCount: integer("interval_count").notNull().default(1),
  active: boolean("active").notNull().default(true),
  features: jsonb("features").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Razorpay customers table
export const razorpayCustomersTable = pgTable("razorpay_customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  razorpayCustomerId: text("razorpay_customer_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  contact: text("contact"),
  notes: jsonb("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Subscriptions table
export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  planId: uuid("plan_id").references(() => subscriptionPlansTable.id),
  customerId: uuid("customer_id").references(() => razorpayCustomersTable.id),
  razorpaySubscriptionId: text("razorpay_subscription_id").notNull().unique(),
  status: subscriptionStatusEnum("status").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  cancelledAt: timestamp("cancelled_at"),
  endedAt: timestamp("ended_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Subscription payments table
export const subscriptionPaymentsTable = pgTable("subscription_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  subscriptionId: uuid("subscription_id").references(
    () => subscriptionsTable.id,
    {
      onDelete: "set null",
    },
  ),
  razorpayPaymentId: text("razorpay_payment_id").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull(), // captured, failed, etc.
  invoiceId: text("invoice_id"),
  paymentMethod: text("payment_method"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
