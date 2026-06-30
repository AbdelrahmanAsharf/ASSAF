// src/actions/products.ts
"use server";

import { db } from "@/lib/prisma";

export async function getProductsByCategory(categoryId: string) {
  return await db.product.findMany({
    where: {
      OR: [
        { categoryId },
        { subCategory: { categoryId } },
        { subSubCategory: { subCategory: { categoryId } } },
      ],
    },
  });
}

export async function getProductsBySubCategory(subCategoryId: string) {
  return await db.product.findMany({
    where: {
      OR: [
        { subCategoryId },
        { subSubCategory: { subCategoryId } },
      ],
    },
  });
}

export async function getProductsBySubSubCategory(subSubCategoryId: string) {
  return await db.product.findMany({
    where: { subSubCategoryId },
  });
}

export async function getProductsByCategoryOrSlug(slug: string) {
  const cleanSlug = decodeURIComponent(slug).replace(/-/g, " ").trim();

  



  const category = await db.category.findFirst({
    where: { OR: [{ nameAr: cleanSlug }, { nameEn: cleanSlug }] },
    include: { products: true },
  });
  if (category?.products?.length) return category.products;

  const subCategory = await db.subCategory.findFirst({
    where: { OR: [{ nameAr: cleanSlug }, { nameEn: cleanSlug }] },
    include: { products: true },
  });
  if (subCategory?.products?.length) return subCategory.products;

  return [];
}