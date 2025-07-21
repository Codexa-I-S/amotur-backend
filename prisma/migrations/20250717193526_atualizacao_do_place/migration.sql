/*
  Warnings:

  - Added the required column `localization` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "localization" TEXT NOT NULL;
