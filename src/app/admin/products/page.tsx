// app/admin/products/page.tsx
import { db } from "@/lib/prisma";
import { AddProductForm } from "./AddProductForm";
import { ProductsTable } from "./Productstable";

export default async function ProductsPage() {
  const [products, categories, subCategories, subSubCategories] =
    await Promise.all([
      db.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { nameAr: true } },
          subCategory: { select: { nameAr: true } },
          subSubCategory: { select: { nameAr: true } },
        },
      }),
      db.category.findMany({ orderBy: { nameAr: "asc" } }),
      db.subCategory.findMany({
        orderBy: { nameAr: "asc" },
        include: { category: { select: { nameAr: true } } },
      }),
      db.subSubCategory.findMany({
        orderBy: { nameAr: "asc" },
        include: { subCategory: { select: { nameAr: true } } },
      }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
        <p className="text-sm text-gray-400 mt-0.5">{products.length} منتج إجمالي</p>
      </div>

      <AddProductForm
        categories={categories}
        subCategories={subCategories}
        subSubCategories={subSubCategories}
      />

      <ProductsTable products={products} />
    </div>
  );
}