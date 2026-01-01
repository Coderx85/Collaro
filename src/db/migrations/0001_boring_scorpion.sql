CREATE TYPE "public"."meeting_status" AS ENUM('scheduled', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."participant_status" AS ENUM('invited', 'joined', 'left', 'declined');--> statement-breakpoint
CREATE TABLE "meeting_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp,
	"status" "participant_status" DEFAULT 'invited' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace_meetings" ADD COLUMN "status" "meeting_status" DEFAULT 'scheduled' NOT NULL;--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_meeting_id_workspace_meetings_meeting_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."workspace_meetings"("meeting_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meeting_participants_meeting_member_unique_idx" ON "meeting_participants" USING btree ("meeting_id","member_id");--> statement-breakpoint
CREATE INDEX "meeting_participants_meeting_id_idx" ON "meeting_participants" USING btree ("meeting_id");