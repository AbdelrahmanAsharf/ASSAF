/*
  Warnings:

  - You are about to drop the column `compositionAr` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `compositionEn` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionAr` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEn` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inspirationAr` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inspirationEn` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stableId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `titleAr` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyAr` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyEn` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductSubCategories` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `stableId` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `nameAr` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `stableId` on table `SubCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProductMedia" DROP CONSTRAINT "ProductMedia_productId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategories" DROP CONSTRAINT "_ProductCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategories" DROP CONSTRAINT "_ProductCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSubCategories" DROP CONSTRAINT "_ProductSubCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSubCategories" DROP CONSTRAINT "_ProductSubCategories_B_fkey";

-- DropIndex
DROP INDEX "Product_stableId_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "stableId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "compositionAr",
DROP COLUMN "compositionEn",
DROP COLUMN "descriptionAr",
DROP COLUMN "descriptionEn",
DROP COLUMN "inspirationAr",
DROP COLUMN "inspirationEn",
DROP COLUMN "modelNumber",
DROP COLUMN "stableId",
DROP COLUMN "titleAr",
DROP COLUMN "titleEn",
DROP COLUMN "warrantyAr",
DROP COLUMN "warrantyEn",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "nameAr" TEXT NOT NULL,
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "subCategoryId" TEXT,
ADD COLUMN     "subSubCategoryId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "stableId" SET NOT NULL;

-- DropTable
DROP TABLE "ProductMedia";

-- DropTable
DROP TABLE "_ProductCategories";

-- DropTable
DROP TABLE "_ProductSubCategories";

-- DropEnum
DROP TYPE "Language";

-- DropEnum
DROP TYPE "MediaType";

-- CreateTable
CREATE TABLE "SubSubCategory" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "stableId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubSubCategory_stableId_key" ON "SubSubCategory"("stableId");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubSubCategory" ADD CONSTRAINT "SubSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subSubCategoryId_fkey" FOREIGN KEY ("subSubCategoryId") REFERENCES "SubSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
