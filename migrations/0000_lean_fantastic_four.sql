CREATE TABLE "meeting" (
	"id" uuid PRIMARY KEY NOT NULL,
	"description" text DEFAULT 'Instant Meeting',
	"hosted_by" uuid NOT NULL,
	"workspace_id" uuid NOT NULL
);
