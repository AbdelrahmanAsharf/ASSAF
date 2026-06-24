/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Hanger } from "@/components/ui/hanger";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { slugify } from "@/lib/slugify";
import ProductCard from "@/components/ProductCard/ProductCard";
import { CircleCheck, CircleX, SaudiRiyal, Star } from "lucide-react";
import Image from "next/image";
import ProductActions from "@/components/ProductActions";
import { getProductsByCategoryOrSlug } from "@/actions/getProducts";
import { getTranslations } from "next-intl/server";
import { Handbag } from "lucide-react";
import {
  getProductsByCategory,
  getProductsBySubCategory,
} from "@/actions/products";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { locale, slug, id } = await params;

  const t = await getTranslations("ProductPage");
  const dir = locale === "ar" ? "rtl" : "ltr";
  const type = id[0];
  const realStableId = id;

  const decodedSlug = decodeURIComponent(slug);
  const cleanSlug = decodedSlug.replace(/-/g, " ").trim();

  const isSpecialPage =
    cleanSlug === "الجديد" ||
    cleanSlug === "new" ||
    cleanSlug === "جميع المنتجات" ||
    cleanSlug === "all products";

  if (isSpecialPage) {
    const specialProducts = await getProductsByCategoryOrSlug(slug);

    if (specialProducts.length === 0) return notFound();

    const pageTitle =
      cleanSlug.includes("جديد") || cleanSlug === "new"
        ? t("newArrivals")
        : t("allProducts");

    const crumbs = [{ title: pageTitle }];
    return (
      <div className="pt-20 lg:pt-35 mt-10">
        <Breadcrumbs crumbs={crumbs} />
        <div className="container">
          <h2 className="font-extrabold text-2xl mb-6">{pageTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 my-6">
            {specialProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                stableId={p.stableId}
                id={p.id}
                image={p.imageUrl}
                nameAr={p.nameAr}
                nameEn={p.nameEn}
                price={p.price}
                oldprice={p.oldPrice}
                stock={p.stock}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "c") {
    const category = await db.category.findUnique({
      where: { stableId: realStableId },
      include: {
        products: true,
        subCategories: { include: { products: true } },
      },
    });

    if (!category) return notFound();

    const categoryName = locale === "ar" ? category.nameAr : category.nameEn;
    const crumbs = [{ title: categoryName }];
    const products = await getProductsByCategory(category.id);

    return (
      <div className="pt-20 lg:pt-35 mt-10">
        <Breadcrumbs crumbs={crumbs} />
        <div className="  container">
          {/* SubCategories */}
          {category.subCategories.length > 0 && (
            <>
              {category.subCategories.length > 9 ? (
                <Carousel opts={{ direction: dir }} className="mx-9">
                  <CarouselContent className="my-4 ">
                    {category.subCategories.map((sub) => {
                      const subName = locale === "ar" ? sub.nameAr : sub.nameEn;
                      const subSlug = slugify(subName);
                      return (
                        <CarouselItem key={sub.id} className="basis-auto px-2">
                          <Link
                            href={`/${subSlug}/${sub.stableId}`}
                            className="flex flex-col items-center group"
                          >
                            <div className="bg-black rounded-xl w-28 h-28 flex items-center justify-center overflow-hidden">
                              <Hanger className="w-12 h-12 text-gray-300 transition-transform group-hover:scale-90 group-hover:-translate-y-2" />
                            </div>
                            <span className="mt-2 text-sm font-medium text-center">
                              {subName}
                            </span>
                          </Link>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="flex gap-4  my-6">
                  {category.subCategories.map((sub) => {
                    const subName = locale === "ar" ? sub.nameAr : sub.nameEn;
                    const subSlug = slugify(subName);
                    return (
                      <Link
                        key={sub.id}
                        href={`/${subSlug}/${sub.stableId}`}
                        className="flex flex-col items-center group"
                      >
                        <div className="bg-black rounded-xl w-28 h-28 flex items-center justify-center overflow-hidden">
                          <Hanger className="w-12 h-12 text-gray-300 transition-transform group-hover:scale-90 group-hover:-translate-y-2" />
                        </div>
                        <span className="mt-2 text-sm font-medium">
                          {subName}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <h2 className="font-extrabold text-2xl mb-6">{categoryName}</h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 my-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  stableId={p.stableId}
                  id={p.id}
                  image={p.imageUrl}
                  nameAr={p.nameAr}
                  nameEn={p.nameEn}
                  price={p.price}
                  oldprice={p.oldPrice}
                  stock={p.stock}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 py-25 ">
              <div className="rounded-full bg-indigo-50 p-15">
                <Handbag className="w-15 h-15 text-gray-400 " />
              </div>
              <p className="text-sm font-medium text-gray-400">
                {locale === "ar"
                  ? "لا توجد منتجات في هذا القسم"
                  : "No products in this category"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === "s") {
    const subCategory = await db.subCategory.findUnique({
      where: { stableId: realStableId },
      include: { products: true, category: true },
    });

    if (!subCategory) return notFound();

    const catName =
      locale === "ar"
        ? subCategory.category.nameAr
        : subCategory.category.nameEn;
    const subName = locale === "ar" ? subCategory.nameAr : subCategory.nameEn;

    const crumbs = [
      {
        title: catName,
        href: `/${slugify(catName)}/${subCategory.category.stableId}`,
      },
      { title: subName },
    ];
    const products = await getProductsBySubCategory(subCategory.id);
    return (
      <div className=" pt-20 lg:pt-35 mt-10">
        <Breadcrumbs crumbs={crumbs} />
        <h2 className="font-extrabold text-2xl mb-6 container">
          {locale === "ar"
            ? `${catName} | ${subName}`
            : `${catName} | ${subName}`}
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 my-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                stableId={p.stableId}
                id={p.id}
                image={p.imageUrl}
                nameAr={p.nameAr}
                nameEn={p.nameEn}
                price={p.price}
                oldprice={p.oldPrice}
                stock={p.stock}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 py-25 ">
            <div className="rounded-full bg-indigo-50 p-15">
              <Handbag className="w-15 h-15 text-gray-400 " />
            </div>
            <p className="text-sm font-medium text-gray-400">
              {locale === "ar"
                ? "لا توجد منتجات في هذا القسم"
                : "No products in this category"}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (type === "p") {
    const product = await db.product.findUnique({
      where: { stableId: realStableId },
      include: { category: true, subCategory: true, subSubCategory: true },
    });

    if (!product) return notFound();

    const title = locale === "ar" ? product.nameAr : product.nameEn;
    const mainCategory = product.category;
    const mainSubCategory = product.subCategory;

    const catName = mainCategory
      ? locale === "ar"
        ? mainCategory.nameAr
        : mainCategory.nameEn
      : null;

    const subName = mainSubCategory
      ? locale === "ar"
        ? mainSubCategory.nameAr
        : mainSubCategory.nameEn
      : null;

    const crumbs = [
      ...(catName && mainCategory
        ? [
            {
              title: catName,
              href: `/${slugify(catName)}/${mainCategory.stableId}`,
            },
          ]
        : []),
      ...(subName && mainSubCategory
        ? [
            {
              title: subName,
              href: `/${slugify(subName)}/${mainSubCategory.stableId}`,
            },
          ]
        : []),
      { title },
    ];

    return (
      <div className="pt-20 lg:pt-35 mt-10">
        <div className="container ">
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:sticky lg:top-24 z-10 h-fit">
              <div className="relative w-full h-96 lg:h-175 overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.imageUrl}
                  alt={title}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 py-2">
                  <div className="flex items-center text-red-400">
                    <span className="text-2xl font-medium">
                      {product.price}
                    </span>
                    <SaudiRiyal className="w-5 h-5 ml-1" />
                  </div>
                  {product.oldPrice > 0 && (
                    <div className="flex items-center text-black line-through">
                      <span className="text-base">{product.oldPrice}</span>
                      <SaudiRiyal className="w-4 h-4 ml-1" />
                    </div>
                  )}
                </div>

                <p
                  className={`font-normal flex items-center gap-1.5 ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {product.stock > 0 ? (
                    <>
                      <CircleCheck className="w-4 h-4" />
                      <span>{t("inStock")}</span>
                    </>
                  ) : (
                    <>
                      <CircleX className="w-4 h-4" />
                      <span>{t("outOfStock")}</span>
                    </>
                  )}
                </p>
              </div>
              <div className="space-y-6">
                {(product.size || product.gender) && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                    {product.size && (
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">
                          {t("size")}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {product.size}
                        </span>
                      </div>
                    )}
                    {product.gender && (
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">
                          {t("gender")}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {product.gender === "Male"
                            ? t("male")
                            : product.gender === "Female"
                              ? t("female")
                              : t("unisex")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <ProductActions
                  id={product.id}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  stock={product.stock}
                  title={title}
                  image={product.imageUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return notFound();
}
