/*
  Warnings:

  - A unique constraint covering the columns `[stableId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stableId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stableId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_stableId_key" ON "Product"("stableId");
