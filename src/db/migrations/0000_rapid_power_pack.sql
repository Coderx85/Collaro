DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace
    WHERE pg_type.typname = 'role' AND pg_namespace.nspname = 'public'
  ) THEN
    CREATE TYPE "public"."role" AS ENUM('admin', 'member');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "workspace_meeting_attendees" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "meeting_id" uuid NOT NULL,
  "workspace_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" "role" DEFAULT 'member' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "workspace_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" "role" DEFAULT 'member' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "workspace_id" uuid NOT NULL,
  "role" "role" DEFAULT 'member' NOT NULL,
  "joined_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "user_name" text NOT NULL,
  "clerkId" varchar(256) NOT NULL,
  "email" varchar(256) NOT NULL,
  "workspace_id" uuid,
  "role" "role" DEFAULT 'member' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp,
  CONSTRAINT "users_user_name_unique" UNIQUE("user_name"),
  CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId"),
  CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "workspace_meetings" (
  "meeting_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "hosted_by" text NOT NULL,
  "description" text DEFAULT 'Instant Meeting',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "end_at" timestamp
);

CREATE TABLE IF NOT EXISTS "workspaces" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_by" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp,
  CONSTRAINT "workspaces_name_unique" UNIQUE("name"),
  CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspace_meeting_attendees_meeting_id_workspace_meetings_meeting_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspace_meeting_attendees"
      ADD CONSTRAINT "workspace_meeting_attendees_meeting_id_workspace_meetings_meeting_id_fk"
        FOREIGN KEY ("meeting_id")
        REFERENCES "public"."workspace_meetings"("meeting_id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspace_meeting_attendees_workspace_id_workspaces_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspace_meeting_attendees"
      ADD CONSTRAINT "workspace_meeting_attendees_workspace_id_workspaces_id_fk"
        FOREIGN KEY ("workspace_id")
        REFERENCES "public"."workspaces"("id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspace_meeting_attendees_user_id_users_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspace_meeting_attendees"
      ADD CONSTRAINT "workspace_meeting_attendees_user_id_users_id_fk"
        FOREIGN KEY ("user_id")
        REFERENCES "public"."users"("id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspace_users_workspace_id_workspaces_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspace_users"
      ADD CONSTRAINT "workspace_users_workspace_id_workspaces_id_fk"
        FOREIGN KEY ("workspace_id")
        REFERENCES "public"."workspaces"("id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspace_users_user_id_users_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspace_users"
      ADD CONSTRAINT "workspace_users_user_id_users_id_fk"
        FOREIGN KEY ("user_id")
        REFERENCES "public"."users"("id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'members_user_id_users_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "members"
      ADD CONSTRAINT "members_user_id_users_id_fk"
        FOREIGN KEY ("user_id")
        REFERENCES "public"."users"("id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'members_workspace_id_workspaces_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "members"
      ADD CONSTRAINT "members_workspace_id_workspaces_id_fk"
        FOREIGN KEY ("workspace_id")
        REFERENCES "public"."workspaces"("id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_workspace_id_workspaces_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "users_workspace_id_workspaces_id_fk"
        FOREIGN KEY ("workspace_id")
        REFERENCES "public"."workspaces"("id")
        ON DELETE no action
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspace_meetings_workspace_id_workspaces_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspace_meetings"
      ADD CONSTRAINT "workspace_meetings_workspace_id_workspaces_id_fk"
        FOREIGN KEY ("workspace_id")
        REFERENCES "public"."workspaces"("id")
        ON DELETE cascade
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspace_meetings_hosted_by_users_user_name_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspace_meetings"
      ADD CONSTRAINT "workspace_meetings_hosted_by_users_user_name_fk"
        FOREIGN KEY ("hosted_by")
        REFERENCES "public"."users"("user_name")
        ON DELETE set null
        ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'workspaces_created_by_users_user_name_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE "workspaces"
      ADD CONSTRAINT "workspaces_created_by_users_user_name_fk"
        FOREIGN KEY ("created_by")
        REFERENCES "public"."users"("user_name")
        ON DELETE set null
        ON UPDATE no action;
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS "wma_meeting_user_unique_idx" ON "workspace_meeting_attendees" USING btree ("meeting_id","user_id");
CREATE INDEX IF NOT EXISTS "wma_workspace_idx" ON "workspace_meeting_attendees" USING btree ("workspace_id");
CREATE INDEX IF NOT EXISTS "wma_user_idx" ON "workspace_meeting_attendees" USING btree ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "workspace_users_workspace_user_unique_idx" ON "workspace_users" USING btree ("workspace_id","user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "members_user_workspace_unique_idx" ON "members" USING btree ("user_id","workspace_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique_idx" ON "users" USING btree ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_user_name_unique_idx" ON "users" USING btree ("user_name");
CREATE INDEX IF NOT EXISTS "workspace_meetings_workspace_id_idx" ON "workspace_meetings" USING btree ("workspace_id");
CREATE INDEX IF NOT EXISTS "workspace_meetings_hosted_by_idx" ON "workspace_meetings" USING btree ("hosted_by");
CREATE UNIQUE INDEX IF NOT EXISTS "workspaces_name_unique_idx" ON "workspaces" USING btree ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "workspaces_slug_unique_idx" ON "workspaces" USING btree ("slug");