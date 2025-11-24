CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'revoked', 'expired');--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."invitation_status";--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "status" SET DATA TYPE "public"."invitation_status" USING "status"::"public"."invitation_status";