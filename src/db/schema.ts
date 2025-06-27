import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const meetingTable = pgTable("meeting", {
  id: uuid("id").primaryKey().notNull(),
  description: text("description").default("Instant Meeting"),
  hostedBy: uuid("hosted_by").notNull(),
  workspaceId: uuid("workspace_id").notNull(),
});

export type CreateMeetingType = typeof meetingTable.$inferInsert;

export type SelectMeetingType = typeof meetingTable.$inferSelect;
