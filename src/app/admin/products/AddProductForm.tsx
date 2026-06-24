// app/admin/products/AddProductForm.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { addProduct } from "@/actions/admin";
import { useImageUpload } from "./useImageUpload";
import { ImageUploader } from "./ImageUploader";
import { Category, SubCategory, SubSubCategory } from "./types";

interface Props {
  categories: Category[];
  subCategories: SubCategory[];
  subSubCategories: SubSubCategory[];
}

export function AddProductForm({ categories, subCategories, subSubCategories }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { imagePreview, isUploading, fileInputRef, handleFileChange, handleRemoveImage, uploadToCloudinary, reset } = useImageUpload();

  function handleSubmit(formData: FormData) {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("ارفع صورة للمنتج أولاً");
      return;
    }

startTransition(async () => {
  try {
    // 1. رفع الصورة
    console.log("1️⃣ جاري رفع الصورة...");
    const imageUrl = await uploadToCloudinary();
    console.log("2️⃣ الصورة اترفعت:", imageUrl);

    // 2. إضافة المنتج
    formData.set("imageUrl", imageUrl);
    console.log("3️⃣ جاري إضافة المنتج...");
    await addProduct(formData);
    console.log("4️⃣ المنتج اتضاف ✅");

    router.refresh();
    toast.success("تم إضافة المنتج ✅");
    reset();
  } catch (err) {
    console.error("❌ Error:", err);
    toast.error(err instanceof Error ? err.message : "حدث خطأ");
  }
});
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-semibold text-gray-800 mb-5 pb-4 border-b border-gray-100">
        إضافة منتج جديد
      </h2>

      <form action={handleSubmit} className="space-y-4">
        {/* Image */}
        <ImageUploader
          imagePreview={imagePreview}
          isUploading={isUploading}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onRemove={handleRemoveImage}
        />

        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">اسم المنتج بالعربي</label>
            <input name="nameAr" placeholder="مثال: عطر فيكتوريا" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Product name in English</label>
            <input name="nameEn" placeholder="e.g. Victoria Perfume" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
        </div>

        {/* Price + Stock + Size */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">السعر</label>
            <input name="price" type="number" step="0.01" placeholder="0.00" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">السعر القديم</label>
            <input name="oldPrice" type="number" step="0.01" placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">المخزن</label>
            <input name="stock" type="number" placeholder="0" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">الحجم</label>
            <input name="size" placeholder="100ml" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">الجنس</label>
          <select name="gender" className="w-full md:w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-600 bg-white">
            <option value="">اختر (اختياري)</option>
            <option value="Male">رجالي</option>
            <option value="Female">نسائي</option>
            <option value="Unisex">للجنسين</option>
          </select>
        </div>

        {/* Category */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">القسم — اختر مستوى واحد بس</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">قسم رئيسي</label>
              <select name="categoryId" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-700">
                <option value="">—</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">قسم فرعي</label>
              <select name="subCategoryId" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-700">
                <option value="">—</option>
                {subCategories.map((s) => <option key={s.id} value={s.id}>{s.category.nameAr} ← {s.nameAr}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">قسم تالت</label>
              <select name="subSubCategoryId" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-700">
                <option value="">—</option>
                {subSubCategories.map((s) => <option key={s.id} value={s.id}>{s.subCategory.nameAr} ← {s.nameAr}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || isUploading}
          className="bg-black text-white px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          {isUploading ? "جاري رفع الصورة..." : isPending ? "جاري الإضافة..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}