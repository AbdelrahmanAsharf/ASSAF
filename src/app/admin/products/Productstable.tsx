// app/admin/products/ProductsTable.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteProduct } from "@/actions/admin";
import { Trash2, Package } from "lucide-react";
import Image from "next/image";
import { Product } from "./types";

export function ProductsTable({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("id", id);
        await deleteProduct(fd);
        router.refresh();
        toast.success("تم حذف المنتج");
      } catch {
        toast.error("حدث خطأ في الحذف");
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">قائمة المنتجات</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-400">المنتج</th>
              <th className="p-4 text-xs font-medium text-gray-400">السعر</th>
              <th className="p-4 text-xs font-medium text-gray-400">المخزن</th>
              <th className="p-4 text-xs font-medium text-gray-400">القسم</th>
              <th className="p-4 text-xs font-medium text-gray-400">الحجم / الجنس</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Package className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400 text-sm">لا يوجد منتجات بعد</p>
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image src={p.imageUrl} alt={p.nameAr} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{p.nameAr}</p>
                      <p className="text-xs text-gray-400">{p.nameEn}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-gray-800 text-sm">{p.price} ج</p>
                  {p.oldPrice > 0 && <p className="text-xs text-gray-400 line-through">{p.oldPrice} ج</p>}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                    p.stock === 0 ? "bg-red-50 text-red-600"
                    : p.stock < 10 ? "bg-orange-50 text-orange-600"
                    : "bg-green-50 text-green-600"
                  }`}>
                    {p.stock === 0 ? "نفد" : p.stock}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {p.subSubCategory?.nameAr || p.subCategory?.nameAr || p.category?.nameAr || (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  <span>{p.size || "—"}</span>
                  {p.gender && (
                    <span className="mr-2 px-2 py-0.5 bg-gray-100 rounded-md text-xs">
                      {p.gender === "Male" ? "رجالي" : p.gender === "Female" ? "نسائي" : "للجنسين"}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={isPending}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}