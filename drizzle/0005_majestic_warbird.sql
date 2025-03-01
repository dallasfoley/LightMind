ALTER TABLE "journals" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "reminders" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "journalStreak";