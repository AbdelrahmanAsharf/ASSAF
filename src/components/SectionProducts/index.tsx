/* eslint-disable @typescript-eslint/no-explicit-any */

import { getProductsByCategoryOrSlug } from "@/actions/getProducts";
import ProductCard from "@/components/ProductCard/ProductCard";
import { Handbag } from "lucide-react";

interface SectionProductsProps {
  title: string;
  locale: string; 
  limit?: number; 
}

export default async function SectionProducts({ title, locale, limit = 4 }: SectionProductsProps) {
  
  const products = await getProductsByCategoryOrSlug(title);
  console.log(products)

  const limitedProducts = products.slice(0, limit);

  return (
    <section className="section-gap container mx-auto w-full ">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {limitedProducts.length > 0 ? (
          limitedProducts.map((p: any) => (
            <ProductCard
              key={p.id}
              id={p.id}
              stableId={p.stableId}
              image={p.imageUrl}
              nameAr={p.nameAr}
              nameEn={p.nameEn}
              price={p.price}
              oldprice={p.oldPrice}
              stock={p.stock}
            />
          ))
        ) : (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 flex justify-center w-full">
            <div className="flex flex-col items-center gap-5 py-25">
              <div className="rounded-full bg-indigo-50 p-15">
                <Handbag className="w-15 h-15 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">
                {locale === "ar" ? "لا توجد منتجات في هذا القسم" : "No products in this category"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
