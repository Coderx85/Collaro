import { pgTable, text, timestamp, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Define role enum first
export const roleEnum = pgEnum("role", ["owner", "admin", "member"]);

// Workspaces table definition
export const workspacesTable = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdBy: uuid('created_by').notNull().references((): any => usersTable.id, {
    onDelete: 'set null'
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
});

// Users table definition
export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  userName: text('user_name').notNull().unique(),
  clerkId: varchar('clerkId', { length: 256 }).notNull().unique(),
  email: text('email').notNull().unique(),
  role: roleEnum('role').notNull().default('member'),
  workspaceId: uuid('workspace_id').references(() => workspacesTable.id, { 
    onDelete: 'set null' 
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
});

// Workspace users junction table
export const workspaceUsersTable = pgTable('workspace_users', {
  name: text('name').notNull(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id, { 
      onDelete: 'cascade' 
    }),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { 
      onDelete: 'cascade' 
    }),
  role: roleEnum('role').notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
});

// Workspace meetings table
export const workspaceMeetingTable = pgTable('workspace_meetings', {
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id, { 
      onDelete: 'cascade' 
    }),
  name: text('name').notNull(),
  description: text('description').default('Instant Meeting'),
  hostedBy: uuid('hosted_by')
    .notNull()
    .references(() => usersTable.id, { 
      onDelete: 'set null' 
    }),
  meetingId: uuid('meeting_id').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at')
});