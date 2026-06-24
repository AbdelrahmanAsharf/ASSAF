// actions/getProducts.ts
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

export async function getProductsByCategoryOrSlug(slug: string) {
  const decoded = decodeURIComponent(slug).replace(/-/g, " ").trim();
  const isNew = decoded === "الجديد" || decoded === "new";

  if (isNew) {
    return await db.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  return await db.product.findMany({
    where: {
      OR: [
        { nameAr: { contains: decoded } },
        { nameEn: { contains: decoded } },
      ],
    },
  });
}