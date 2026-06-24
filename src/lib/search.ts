// src/lib/search.ts
import { db } from "@/lib/prisma"; // ✅ استخدم الـ db الموجود

export type SearchResults = {
  products: {
    id: string;
    stableId: string;
    imageUrl: string;
    nameAr: string;
    nameEn: string;
    price: number;
    oldPrice: number;
    stock: number;
  }[];
  categories: {
    id: string;
    stableId: string | null;
    nameAr: string;
    nameEn: string;
  }[];
  subCategories: {
    id: string;
    stableId: string | null;
    nameAr: string;
    nameEn: string;
  }[];
  total: number;
  query: string;
};

export async function searchEverything(
  query: string,
  limit = 20
): Promise<SearchResults> {
  const sanitized = query.trim();
  if (!sanitized) {
    return { products: [], categories: [], subCategories: [], total: 0, query: "" };
  }

  const [products, categories, subCategories] = await Promise.all([
    db.product.findMany({
      where: {
        OR: [
          { nameAr: { contains: sanitized, mode: "insensitive" } },
          { nameEn: { contains: sanitized, mode: "insensitive" } },
        ],
      },
      select: { id: true, stableId: true, imageUrl: true, nameAr: true, nameEn: true, price: true, oldPrice: true, stock: true },
      take: limit,
      orderBy: { price: "asc" },
    }),
    db.category.findMany({
      where: {
        OR: [
          { nameAr: { contains: sanitized, mode: "insensitive" } },
          { nameEn: { contains: sanitized, mode: "insensitive" } },
        ],
      },
      select: { id: true, stableId: true, nameAr: true, nameEn: true },
      take: 10,
    }),
    db.subCategory.findMany({
      where: {
        OR: [
          { nameAr: { contains: sanitized, mode: "insensitive" } },
          { nameEn: { contains: sanitized, mode: "insensitive" } },
        ],
      },
      select: { id: true, stableId: true, nameAr: true, nameEn: true },
      take: 10,
    }),
  ]);

  return {
    products,
    categories,
    subCategories,
    total: products.length + categories.length + subCategories.length,
    query: sanitized,
  };
}