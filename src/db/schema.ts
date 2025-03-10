import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  clerId: text('cler_id').notNull().unique(),
  email: text('email').notNull().unique(),
  workspace: text('workspace'),
  workspaceId: integer('workspace_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
});

export const workspacesTable = pgTable(
  'workspaces', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  workspaceId: text('workspace_id').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
});
