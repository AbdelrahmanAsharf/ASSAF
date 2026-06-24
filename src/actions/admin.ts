// actions/admin.ts — شيل revalidatePath من categories actions
"use server";

import { db } from "@/lib/prisma";
import { stableId } from "@/lib/slugify";
import { revalidatePath } from "next/cache";



export async function addCategory(formData: FormData) {
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  if (!nameAr || !nameEn) throw new Error("البيانات ناقصة");
  await db.category.create({
    data: { nameAr, nameEn, stableId: stableId(nameAr, "c") },
  });
}

export async function deleteCategory(id: string) {
  if (!id) throw new Error("ID مطلوب");
  await db.category.delete({ where: { id } });
}

export async function addSubCategory(formData: FormData) {
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const categoryId = formData.get("categoryId") as string;
  if (!nameAr || !nameEn || !categoryId) throw new Error("البيانات ناقصة");
  await db.subCategory.create({
    data: { nameAr, nameEn, categoryId, stableId: stableId(nameAr, "s") },
  });
}

export async function deleteSubCategory(id: string) {
  if (!id) throw new Error("ID مطلوب");
  await db.subCategory.delete({ where: { id } });
}

export async function addSubSubCategory(formData: FormData) {
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const subCategoryId = formData.get("subCategoryId") as string;
  if (!nameAr || !nameEn || !subCategoryId) throw new Error("البيانات ناقصة");
  await db.subSubCategory.create({
    data: { nameAr, nameEn, subCategoryId, stableId: stableId(nameAr, "s") },
  });
}

export async function deleteSubSubCategory(id: string) {
  if (!id) throw new Error("ID مطلوب");
  await db.subSubCategory.delete({ where: { id } });
}

export async function addProduct(formData: FormData) {
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;
  if (!nameAr || !nameEn || !price || !imageUrl)
    throw new Error("البيانات ناقصة");
  await db.product.create({
    data: {
      nameAr,
      nameEn,
      price,
      imageUrl,
      stableId: stableId(nameAr, "p"),
      oldPrice: parseFloat(formData.get("oldPrice") as string) || 0,
      stock: parseInt(formData.get("stock") as string) || 0,
      size: (formData.get("size") as string) || null,
      gender: (formData.get("gender") as string) || null,
      categoryId: (formData.get("categoryId") as string) || null,
      subCategoryId: (formData.get("subCategoryId") as string) || null,
      subSubCategoryId: (formData.get("subSubCategoryId") as string) || null,
    },
  });
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("ID مطلوب");
  await db.product.delete({ where: { id } });
}

export async function changeUserRole(userId: string, role: "USER" | "ADMIN") {
  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}