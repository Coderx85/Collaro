ALTER TABLE "notifications" ALTER COLUMN "member_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "join_requests" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "type" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "notification_type";