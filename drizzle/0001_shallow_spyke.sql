ALTER TABLE "checkIns" ALTER COLUMN "stress" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "checkIns" ADD COLUMN "sleepHours" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "checkIns" ADD COLUMN "sleepQuality" integer NOT NULL;