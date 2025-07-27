/*
  Warnings:

  - Changed the type of `type` on the `Place` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `localization` on the `Place` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('TURISTICO', 'HOTEL', 'POUSADA', 'RESTAURANTE', 'PESTISCARIA', 'BAR');

-- CreateEnum
CREATE TYPE "PlaceRegion" AS ENUM ('ICARAI', 'MOITAS', 'CAETANOS', 'FLECHEIRAS');

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "type",
ADD COLUMN     "type" "PlaceType" NOT NULL,
DROP COLUMN "localization",
ADD COLUMN     "localization" "PlaceRegion" NOT NULL;
