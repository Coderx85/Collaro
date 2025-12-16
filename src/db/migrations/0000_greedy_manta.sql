CREATE TYPE "public"."role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"user_name" text NOT NULL,
	"clerkId" varchar(256) NOT NULL,
	"email" text NOT NULL,
	"workspace_id" uuid,
	"role" "role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workspace_meetings" (
	"meeting_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"hosted_by" text NOT NULL,
	"description" text DEFAULT 'Instant Meeting',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"end_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "workspace_users" (
	"user_name" text NOT NULL,
	"workspace_name" text NOT NULL,
	"role" "role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "workspaces_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_meetings" ADD CONSTRAINT "workspace_meetings_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_meetings" ADD CONSTRAINT "workspace_meetings_hosted_by_users_user_name_fk" FOREIGN KEY ("hosted_by") REFERENCES "public"."users"("user_name") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_users" ADD CONSTRAINT "workspace_users_user_name_users_user_name_fk" FOREIGN KEY ("user_name") REFERENCES "public"."users"("user_name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_users" ADD CONSTRAINT "workspace_users_workspace_name_workspaces_name_fk" FOREIGN KEY ("workspace_name") REFERENCES "public"."workspaces"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_created_by_users_user_name_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_name") ON DELETE set null ON UPDATE no action;