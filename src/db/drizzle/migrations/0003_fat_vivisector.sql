DROP INDEX "notifications_status_idx";--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "read_status" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "notifications_read_status_idx" ON "notifications" USING btree ("read_status");--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "status";