"use server";

import { db } from "@/lib/prisma";
import { stableId } from "@/lib/slugify";
import { Language, MediaType } from "@prisma/client";

export async function addProduct({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  price,
  oldPrice,
  imageUrl,
  categoryIds,
  subCategoryIds = [],
  modelNumber,
  compositionAr,
  compositionEn,
  inspirationAr,
  inspirationEn,
  size,
  gender,
  warrantyAr,
  warrantyEn,
  media = [],
  stock,
}: {
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  oldPrice: number;
  imageUrl: string;
  categoryIds: string[];
  subCategoryIds?: string[];
  modelNumber?: string;
  compositionAr?: string;
  compositionEn?: string;
  inspirationAr?: string;
  inspirationEn?: string;
  size?: string;
  gender?: string;
  warrantyAr?: string;
  warrantyEn?: string;
  media?: Array<{
    url: string;
    language: "AR" | "EN" | "BOTH";
  }>;
  stock: number;
}) {
  const mediaToCreate = [];

  for (const m of media) {
    if (m.language === "AR") {
      // ✅ لو اخترت عربي، يحفظ بس AR
      mediaToCreate.push({
        url: m.url,
        type: MediaType.IMAGE,
        language: Language.AR,
      });
    } else if (m.language === "EN") {
      // ✅ لو اخترت إنجليزي، يحفظ بس EN
      mediaToCreate.push({
        url: m.url,
        type: MediaType.IMAGE,
        language: Language.EN,
      });
    } else if (m.language === "BOTH") {
      // ✅ لو اخترت الاتنين، يحفظ مرتين
      mediaToCreate.push({
        url: m.url,
        type: MediaType.IMAGE,
        language: Language.AR,
      });
      mediaToCreate.push({
        url: m.url,
        type: MediaType.IMAGE,
        language: Language.EN,
      });
    }
  }

  console.log("🔥 mediaToCreate:", mediaToCreate.map(m => ({ url: m.url.substring(0, 50) + "...", language: m.language })));

  const product = await db.product.create({
    data: {
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      price,
      oldPrice,
      imageUrl,
      modelNumber,
      compositionAr,
      compositionEn,
      inspirationAr,
      inspirationEn,
      size,
      gender,
      warrantyAr,
      warrantyEn,
      stock,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
      subCategories: {
        connect: subCategoryIds.map((id) => ({ id })),
      },
      media: {
        create: mediaToCreate, 
      },
      stableId: stableId(titleAr, "p"),
    },
    include: {
      categories: true,
      subCategories: true,
      media: true,
    },
  });

  return product;
}