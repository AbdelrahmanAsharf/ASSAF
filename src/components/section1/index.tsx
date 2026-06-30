"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { slugify } from "@/lib/slugify"; 

export default function Section1() {
  const locale = useLocale(); 
  const t = useTranslations("Section"); 

  const products = [
    {
      titleAr: "مجموعة أورا 35",
      titleEn: "AURA COLLECTION 35",
      image: "/img/Section1/مجموعة أورا 35.jpg",
      stableId: "p1656110305",
    },
    {
      titleAr: "مجموعة الأكثر مبيعًا - اروقيت",
      titleEn: "ARROGATE MILLION CELEBRATION",
      image: "/img/Section1/مجموعة الأكثر مبيعًا - اروقيت.jpg",
      stableId: "p1322288690",
    },
    {
      titleAr: "مسك عساف",
      titleEn: "MUSK ASSAF COLLACTION",
      image: "/img/Section1/مسك عساف.jpg",
      stableId: "p367579297",
    },
    {
      titleAr: "مجموعة أروقت بينك",
      titleEn: "مجموعة اروقيت بينك",
      image: "/img/Section1/مجموعه ارويقت بينك.webp",
      stableId: "p1254590123",
    },
    {
      titleAr: "مجموعة فرانكل - 800 مل",
      titleEn: "مجموعة فرانكل - 800 مل",
      image: "/img/Section1/مجموعه فرانكل.webp",
      stableId: "p303971178",
    },
    {
      titleAr: "مجموعة بيقاسوس مع قريس ايرك 200 مل",
      titleEn: "PEGASUS COLLECTION + GRIS ERIK",
      image: "/img/Section1/مجموعه بيقاسوس.webp",
      stableId: "p783333950",
    },
  ];

  return (
    <section className="section-gap">
      <div className="container">
        <div className="menu text-center">
          <h1 className="font-semibold text-4xl">{t("octoberOffers")}</h1>
          <p className="font-normal text-xl pt-2">{t("giftSets")}</p>
        </div>
        <div className="mt-15 mb-30  grid grid-cols-2  md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, index) => {
            const titleToSlug = locale === "ar" ? product.titleAr : product.titleEn || product.titleAr;
            const titleSlug = slugify(titleToSlug);
            const productStableId = product.stableId;
            const productLink = `/${locale}/${titleSlug}/${productStableId}`;

            return (
              <Link
                key={index}
                href={productLink}
                className="block relative w-full h-75  shadow-lg overflow-visible group rounded-lg transition-all duration-300 ease-in-out z-0 hover:z-10"
              >
                <div
                  className="relative w-full h-full overflow-hidden rounded-lg transition-all duration-300 ease-in-out
                     group-hover:scale-110 group-hover:shadow-2xl"
                >
                  <Image
                    src={product.image}
                    alt={`هدية ${locale === "ar" ? product.titleAr : product.titleEn}`}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

