ALTER TABLE "workspace_meetings" ALTER COLUMN "title" SET DEFAULT 'Untitled Meeting';--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;