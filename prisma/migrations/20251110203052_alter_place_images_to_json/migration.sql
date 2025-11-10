/*
  Warnings:

  - The `images` column on the `Place` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `logo` on the `Place` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Place" DROP COLUMN "logo",
ADD COLUMN     "logo" JSONB NOT NULL,
DROP COLUMN "images",
ADD COLUMN     "images" JSONB[];
