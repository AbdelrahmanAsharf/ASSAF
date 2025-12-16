// src/app/[locale]/search/[[...query]]/page.tsx
import { notFound } from "next/navigation";
import { searchEverything } from "@/lib/search";
import ProductCard from "@/components/ProductCard/ProductCard";
import { ShoppingBag } from "lucide-react";

interface Props {
  params: Promise<{
    locale: "ar" | "en";
    query?: string[];
  }>;
}

export default async function SearchPage({ params }: Props) {
  const { locale, query: rawQuery } = await params;


  if (!rawQuery || rawQuery.length === 0) {
    notFound();
  }


  const query = decodeURIComponent(rawQuery.join("/")).trim();

  if (!query) {
    notFound();
  }

  const results = await searchEverything(query, locale);

  return (
    <div className="pt-35 mt-10 container">
      {/* العنوان */}
      <div className="py-8">
        <h1 className="text-xl font-bold">
          البحث عن <span className="text-primary">({results.query})</span>
        </h1>
      </div>

      {/* حالة فارغة كاملة */}
      {results.total === 0 ? (
        <div className="flex flex-col items-center gap-5 py-25">
          <div className="rounded-full bg-blue-50/50 p-15">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-gray-400">لا توجد منتجات</h2>
        </div>
      ) : (
        <div className="space-y-16">
          {/* المنتجات */}
          {results.products.length > 0 ? (
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {results.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    stableId={product.stableId ?? product.id}
                    image={product.imageUrl}
                    titleAr={product.titleAr}
                    titleEn={product.titleEn}
                    price={product.price}
                    oldprice={product.oldPrice}
                    modelnumber={product.modelNumber || null}
                    stock={product.stock}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">لا توجد منتجات مطابقة</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// SEO
export async function generateMetadata({ params }: Props) {
  const { query: rawQuery } = await params;
  const query = rawQuery ? decodeURIComponent(rawQuery.join("/")) : "";
  return {
    title: `بحث عن "${query}" - متجرنا`,
    description: `نتائج البحث عن "${query}" في المنتجات والتصنيفات`,
  };
}