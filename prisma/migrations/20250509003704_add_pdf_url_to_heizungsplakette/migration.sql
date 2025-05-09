/*
  Warnings:

  - Added the required column `alterDerHeizung` to the `Heizungsplakette` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energielabel` to the `Heizungsplakette` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Heizungsplakette" ADD COLUMN     "alterDerHeizung" TEXT NOT NULL,
ADD COLUMN     "energielabel" TEXT NOT NULL,
ADD COLUMN     "herkunft" TEXT,
ADD COLUMN     "paymentStatus" BOOLEAN NOT NULL DEFAULT false;
