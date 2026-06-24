/* eslint-disable @typescript-eslint/no-explicit-any */


export function slugify(str: string) {
  return str
    .toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase();
}

export function stableId(str: string, prefix: "c" | "p" | "s") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return prefix + Math.abs(hash);
}

// lib/navs.ts

export function buildNavsFromDB(categories: any[]) {
  return categories.map((category) => ({
    titleAr: category.nameAr,
    titleEn: category.nameEn,
    stableId: category.stableId,

    subAr: category.subCategories.map((sub: any) => ({
      title: sub.nameAr,
      stableId: sub.stableId,

      subSub: sub.subSubCategories.map((subSub: any) => ({
        title: subSub.nameAr,
        stableId: subSub.stableId,
      })),
    })),

    subEn: category.subCategories.map((sub: any) => ({
      title: sub.nameEn,
      stableId: sub.stableId,

      subSub: sub.subSubCategories.map((subSub: any) => ({
        title: subSub.nameEn,
        stableId: subSub.stableId,
      })),
    })),
  }));
}