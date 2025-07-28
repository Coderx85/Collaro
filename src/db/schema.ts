import { pgTable, text } from "drizzle-orm/pg-core";

export const meetingTable = pgTable("meeting", {
  id: text("id").primaryKey().notNull(),
  description: text("description").default("Instant Meeting"),
  hostedBy: text("hosted_by").notNull(),
  workspaceId: text("workspace_id").notNull(),
});

export type CreateMeetingType = typeof meetingTable.$inferInsert;

export type SelectMeetingType = typeof meetingTable.$inferSelect;
