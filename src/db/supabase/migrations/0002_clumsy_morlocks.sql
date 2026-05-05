ALTER TABLE "notifications" ALTER COLUMN "member_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "join_requests" ADD COLUMN IF NOT EXISTS "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "type" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "notification_type";