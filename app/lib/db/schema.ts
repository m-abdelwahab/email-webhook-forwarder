import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull(),
  webhookUrl: text("webhook_url").notNull(),
  clerkUserId: text("clerk_user_id").notNull(),
  postmarkEmailAddress: text("postmark_email_address").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export type Server = typeof servers.$inferSelect;
