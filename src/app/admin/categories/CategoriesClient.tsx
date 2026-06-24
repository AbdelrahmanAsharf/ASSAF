"use client";

import {
  addCategory,
  deleteCategory,
  addSubCategory,
  deleteSubCategory,
  addSubSubCategory,
  deleteSubSubCategory,
} from "@/actions/admin";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { Trash2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

type SubSubCategory = { id: string; nameAr: string; nameEn: string };

type SubCategory = {
  id: string;
  nameAr: string;
  nameEn: string;
  _count: { products: number };
  subSubCategories: SubSubCategory[];
};

type Category = {
  id: string;
  nameAr: string;
  nameEn: string;
  _count: { products: number };
  subCategories: SubCategory[];
};

// أضف في الأول

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // ✅ أضف ده

  function handleAddCategory(formData: FormData) {
    startTransition(async () => {
      try {
        await addCategory(formData);
        router.refresh(); // ✅ بدل revalidatePath
        toast.success("تم إضافة القسم");
      } catch (err) {
        console.error("addCategory error:", err);
        toast.error(err instanceof Error ? err.message : "حدث خطأ");
      }
    });
  }

  function handleDeleteCategory(id: string) {
    startTransition(async () => {
      try {
        await deleteCategory(id);
        router.refresh(); // ✅
        toast.success("تم حذف القسم");
      } catch (err) {
        console.error("deleteCategory error:", err);
        toast.error(err instanceof Error ? err.message : "حدث خطأ");
      }
    });
  }

  function handleAddSubCategory(formData: FormData) {
    startTransition(async () => {
      try {
        await addSubCategory(formData);
        router.refresh(); // ✅
        toast.success("تم إضافة القسم الفرعي");
      } catch (err) {
        console.error("addSubCategory error:", err);
        toast.error(err instanceof Error ? err.message : "حدث خطأ");
      }
    });
  }

  function handleDeleteSubCategory(id: string) {
    startTransition(async () => {
      try {
        await deleteSubCategory(id);
        router.refresh(); // ✅
        toast.success("تم حذف القسم الفرعي");
      } catch (err) {
        console.error("deleteSubCategory error:", err);
        toast.error(err instanceof Error ? err.message : "حدث خطأ");
      }
    });
  }

  function handleAddSubSubCategory(formData: FormData) {
    startTransition(async () => {
      try {
        await addSubSubCategory(formData);
        router.refresh(); // ✅
        toast.success("تم إضافة القسم التالت");
      } catch (err) {
        console.error("addSubSubCategory error:", err);
        toast.error(err instanceof Error ? err.message : "حدث خطأ");
      }
    });
  }

  function handleDeleteSubSubCategory(id: string) {
    startTransition(async () => {
      try {
        await deleteSubSubCategory(id);
        router.refresh(); // ✅
        toast.success("تم الحذف");
      } catch (err) {
        console.error("deleteSubSubCategory error:", err);
        toast.error(err instanceof Error ? err.message : "حدث خطأ");
      }
    });
  }

  // باقي الـ JSX زي ما هو
  return (
    <div className="space-y-6">
      {/* Add Category */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-100">
          إضافة قسم رئيسي
        </h2>
        <form action={handleAddCategory} className="flex gap-3 flex-wrap">
          <input
            name="nameAr"
            placeholder="اسم القسم بالعربي"
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <input
            name="nameEn"
            placeholder="Category name in English"
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isPending ? "جاري..." : "إضافة"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            {/* Category Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-800">
                  {cat.nameAr} / {cat.nameEn}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {cat.subCategories.length} قسم فرعي · {cat._count.products}{" "}
                  منتج مباشر
                </p>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                disabled={isPending}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Add SubCategory */}
            <div className="p-4 bg-gray-50/50 border-b border-gray-100">
              <form
                action={handleAddSubCategory}
                className="flex gap-3 flex-wrap"
              >
                <input type="hidden" name="categoryId" value={cat.id} />
                <input
                  name="nameAr"
                  placeholder="قسم فرعي بالعربي"
                  required
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-40 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                <input
                  name="nameEn"
                  placeholder="Sub category in English"
                  required
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-40 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-black transition-colors disabled:opacity-50"
                >
                  + فرعي
                </button>
              </form>
            </div>

            {/* SubCategories */}
            {cat.subCategories.length > 0 && (
              <div className="divide-y divide-gray-50">
                {cat.subCategories.map((sub) => (
                  <div key={sub.id} className="p-4 pr-8">
                    {/* Sub Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChevronDown className="w-4 h-4 text-gray-300" />
                        <p className="font-medium text-gray-700 text-sm">
                          {sub.nameAr} / {sub.nameEn}
                        </p>
                        <span className="text-xs text-gray-400">
                          {sub._count.products} منتج ·{" "}
                          {sub.subSubCategories.length} قسم تالت
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSubCategory(sub.id)}
                        disabled={isPending}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* ✅ SubSubCategories — جوف sub.map */}
                    {sub.subSubCategories.length > 0 && (
                      <div className="mt-2 pr-6 space-y-1">
                        {sub.subSubCategories.map((subsub) => (
                          <div
                            key={subsub.id}
                            className="flex items-center justify-between py-1"
                          >
                            <p className="text-sm text-gray-400">
                              — {subsub.nameAr} / {subsub.nameEn}
                            </p>
                            {/* ✅ زرار حذف SubSubCategory */}
                            <button
                              onClick={() =>
                                handleDeleteSubSubCategory(subsub.id)
                              }
                              disabled={isPending}
                              className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ✅ Add SubSubCategory — جوف sub.map */}
                    <form
                      action={handleAddSubSubCategory}
                      className="flex gap-2 mt-3 pr-6"
                    >
                      <input
                        type="hidden"
                        name="subCategoryId"
                        value={sub.id}
                      />
                      <input
                        name="nameAr"
                        placeholder="قسم تالت بالعربي"
                        required
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 bg-white focus:outline-none focus:ring-1 focus:ring-black/10"
                      />
                      <input
                        name="nameEn"
                        placeholder="Sub sub in English"
                        required
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs flex-1 bg-white focus:outline-none focus:ring-1 focus:ring-black/10"
                      />
                      <button
                        type="submit"
                        disabled={isPending}
                        className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-black transition-colors disabled:opacity-50"
                      >
                        + تالت
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
