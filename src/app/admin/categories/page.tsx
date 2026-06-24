// app/admin/categories/page.tsx
import { db } from "@/lib/prisma";
import { CategoriesClient } from "./CategoriesClient";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subCategories: {
        include: {
          subSubCategories: true,
          _count: { select: { products: true } },
        },
      },
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأقسام</h1>
          <p className="text-sm text-gray-400 mt-0.5">{categories.length} قسم رئيسي</p>
        </div>
      </div>
      <CategoriesClient categories={categories} />
    </div>
  );
}