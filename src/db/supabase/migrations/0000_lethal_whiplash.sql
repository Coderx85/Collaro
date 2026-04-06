DROP TYPE IF EXISTS "public"."join_request_status" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."meeting_status" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."notification_type" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."participant_status" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."user_role" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."join_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."meeting_status" AS ENUM('scheduled', 'active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('join_request', 'meeting_invite', 'general');--> statement-breakpoint
CREATE TYPE "public"."participant_status" AS ENUM('invited', 'joined', 'left', 'declined');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "join_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"status" "join_request_status" DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp,
	"responded_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meeting_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"meeting_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp,
	"status" "participant_status" DEFAULT 'invited' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"notification_type" "notification_type" DEFAULT 'general' NOT NULL,
	"message" text NOT NULL,
	"read_status" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "private_meetings" (
	"meeting_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hosted_by" uuid NOT NULL,
	"status" "meeting_status" DEFAULT 'scheduled' NOT NULL,
	"description" text DEFAULT 'Instant Meeting',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"end_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"user_name" text NOT NULL,
	"password" text,
	"email_verified" boolean DEFAULT false,
	"email" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_meetings" (
	"meeting_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"hosted_by" uuid NOT NULL,
	"status" "meeting_status" DEFAULT 'active' NOT NULL,
	"description" text DEFAULT 'Instant Meeting',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"end_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text DEFAULT '',
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "workspaces_name_unique" UNIQUE("name"),
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" DROP CONSTRAINT IF EXISTS "invitation_workspace_id_workspaces_id_fk";--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" DROP CONSTRAINT IF EXISTS "invitation_inviter_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" DROP CONSTRAINT IF EXISTS "join_requests_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" DROP CONSTRAINT IF EXISTS "join_requests_workspace_id_workspaces_id_fk";--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_requests" DROP CONSTRAINT IF EXISTS "join_requests_responded_by_users_id_fk";--> statement-breakpoint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_responded_by_users_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_participants" DROP CONSTRAINT IF EXISTS "meeting_participants_meeting_id_workspace_meetings_meeting_id_fk";--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_meeting_id_workspace_meetings_meeting_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."workspace_meetings"("meeting_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_participants" DROP CONSTRAINT IF EXISTS "meeting_participants_member_id_members_id_fk";--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT IF EXISTS "members_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT IF EXISTS "members_workspace_id_workspaces_id_fk";--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "notifications_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "notifications_workspace_id_workspaces_id_fk";--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "notifications_member_id_members_id_fk";--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_meetings" DROP CONSTRAINT IF EXISTS "private_meetings_hosted_by_users_id_fk";--> statement-breakpoint
ALTER TABLE "private_meetings" ADD CONSTRAINT "private_meetings_hosted_by_users_id_fk" FOREIGN KEY ("hosted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_meetings" DROP CONSTRAINT IF EXISTS "workspace_meetings_workspace_id_workspaces_id_fk";--> statement-breakpoint
ALTER TABLE "workspace_meetings" ADD CONSTRAINT "workspace_meetings_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_meetings" DROP CONSTRAINT IF EXISTS "workspace_meetings_hosted_by_members_id_fk";--> statement-breakpoint
ALTER TABLE "workspace_meetings" ADD CONSTRAINT "workspace_meetings_hosted_by_members_id_fk" FOREIGN KEY ("hosted_by") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" DROP CONSTRAINT IF EXISTS "workspaces_created_by_users_id_fk";--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_workspace_id_idx" ON "invitation" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "join_requests_user_workspace_pending_unique_idx" ON "join_requests" USING btree ("user_id","workspace_id","status") WHERE status = 'pending';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "join_requests_workspace_id_idx" ON "join_requests" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "join_requests_status_idx" ON "join_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "join_requests_user_id_idx" ON "join_requests" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "meeting_participants_meeting_member_unique_idx" ON "meeting_participants" USING btree ("meeting_id","member_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_participants_meeting_id_idx" ON "meeting_participants" USING btree ("meeting_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "members_user_workspace_unique_idx" ON "members" USING btree ("user_id","workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "members_workspace_id_idx" ON "members" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "members_role_idx" ON "members" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_workspace_id_idx" ON "notifications" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_member_id_idx" ON "notifications" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_read_status_idx" ON "notifications" USING btree ("read_status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "private_meetings_hosted_by_unique_idx" ON "private_meetings" USING btree ("hosted_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "private_meetings_hosted_by_idx" ON "private_meetings" USING btree ("hosted_by");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_user_name_unique_idx" ON "users" USING btree ("user_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_meetings_workspace_id_idx" ON "workspace_meetings" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_meetings_hosted_by_idx" ON "workspace_meetings" USING btree ("hosted_by");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "workspaces_name_unique_idx" ON "workspaces" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "workspaces_slug_unique_idx" ON "workspaces" USING btree ("slug");