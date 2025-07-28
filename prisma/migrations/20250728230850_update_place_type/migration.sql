/*
  Warnings:

  - The values [PESTISCARIA] on the enum `PlaceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlaceType_new" AS ENUM ('TURISTICO', 'HOTEL', 'POUSADA', 'RESTAURANTE', 'PETISCARIA', 'BAR');
ALTER TABLE "Place" ALTER COLUMN "type" TYPE "PlaceType_new" USING ("type"::text::"PlaceType_new");
ALTER TYPE "PlaceType" RENAME TO "PlaceType_old";
ALTER TYPE "PlaceType_new" RENAME TO "PlaceType";
DROP TYPE "PlaceType_old";
COMMIT;
