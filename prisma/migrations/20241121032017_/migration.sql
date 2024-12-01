/*
  Warnings:

  - The `tailType` column on the `breeds` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "breeds" DROP COLUMN "tailType",
ADD COLUMN     "tailType" TEXT;
