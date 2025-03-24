CREATE TABLE "servers" (
	"id" serial PRIMARY KEY NOT NULL,
	"server_id" text NOT NULL,
	"webhook_url" text NOT NULL,
	"clerk_user_id" text NOT NULL,
	"postmark_email_address" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
