/*
  Warnings:

  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/

-- ✅ Backfill NULL usernames with UUID strings
UPDATE "User" SET "username" = gen_random_uuid()::text WHERE "username" IS NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
