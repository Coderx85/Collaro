ALTER TABLE "join_requests" DROP CONSTRAINT IF EXISTS "join_requests_responded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "workspace_meetings" ADD COLUMN IF NOT EXISTS "start_time" timestamp NOT NULL;--> statement-breakpoint
DO $$
BEGIN
	ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_responded_by_members_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint