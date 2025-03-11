import { uuid, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'users', {
  id: uuid('id').defaultRandom().primaryKey().unique(),
  name: text('name').notNull(),
  userName: text('user_name').notNull().unique(),
  clerkId: varchar('clerkId').notNull().unique(),
  email: text('email').notNull().unique(),
  workspaceId: uuid('workspaceId')
                .references((): any => workspacesTable.id, { onDelete: 'set null'}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
});

export const workspacesTable = pgTable(
  'workspaces', {
  id: uuid('id').defaultRandom().primaryKey().unique(),
  name: text('name').notNull().unique(),
  createdBy: uuid('createdBy')
                .references(() => usersTable.id, { onDelete: 'set null'})
                .unique()
                .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
});

// export const workspaceUsersTable = pgTable(
//   'workspace_users', {
//     workspaceId: uuid('workspace_id').references(() => workspacesTable.id, { onDelete: 'cascade' }).notNull(),
//     userId: uuid('user_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at')
//   }
// );