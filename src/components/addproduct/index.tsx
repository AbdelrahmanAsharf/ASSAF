"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Bounce, toast } from "react-toastify";
import { addProduct } from "@/actions/addProduct";
import Image from "next/image";

type Cat = { id: string; nameAr: string };
type Sub = { id: string; nameAr: string; categoryId: string };

export default function AddProductForm({
  categories,
  subs,
}: {
  categories: Cat[];
  subs: Sub[];
}) {
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [compositionAr, setCompositionAr] = useState("");
  const [compositionEn, setCompositionEn] = useState("");
  const [inspirationAr, setInspirationAr] = useState("");
  const [inspirationEn, setInspirationEn] = useState("");
  const [warrantyAr, setWarrantyAr] = useState("");
  const [warrantyEn, setWarrantyEn] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [subCategoryIds, setSubCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [oldPrice, setOldPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number>(0);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [mediaLanguages, setMediaLanguages] = useState<("AR" | "EN" | "BOTH")[]>([]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setMediaFiles((prev) => [...prev, ...files]);
    setMediaPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setMediaLanguages((prev) => [...prev, ...files.map(() => "BOTH" as const)]);
  }

  function handleLanguageChange(index: number, lang: "AR" | "EN" | "BOTH") {
    const updated = [...mediaLanguages];
    updated[index] = lang;
    setMediaLanguages(updated);
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      console.log("🚀 بدء رفع المنتج...");

      let imageUrl = "";

      if (imageFile) {

        console.log("📷 جاري رفع الصورة الأساسية:", imageFile.name);

        const base64 = await fileToDataUrl(imageFile);
        console.log("📦 Base64 تم توليده");

        const uploadRes = await fetch(`${window.location.origin}/api/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });


        console.log("📡 تم استدعاء /api/upload، حالة الاستجابة:", uploadRes.status);
        const uploadData = await uploadRes.json();
        console.log("📥 نتيجة الرفع:", uploadData);

        if (uploadData?.secure_url) imageUrl = uploadData.secure_url;
        else if (uploadData?.url) imageUrl = uploadData.url;
        else throw new Error("⚠️ فشل رفع الصورة الأساسية");
      } else {
        console.log("🚫 لا توجد صورة رئيسية محددة.");
      }

      // رفع باقي الصور
      const uploadedMedia: { url: string; language: "AR" | "EN" | "BOTH" }[] = [];
      console.log(`🎞️ عدد الصور الإضافية: ${mediaFiles.length}`);

      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const language = mediaLanguages[i];

        console.log(`⬆️ رفع الصورة رقم ${i + 1}: ${file.name} (${language})`);

        const base64 = await fileToDataUrl(file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        console.log("📡 استجابة رفع إضافية:", uploadRes.status);

        const uploadData = await uploadRes.json();
        console.log("📥 بيانات الصورة الإضافية:", uploadData);

        if (uploadData?.secure_url || uploadData?.url) {
          uploadedMedia.push({
            url: uploadData.secure_url || uploadData.url,
            language,
          });

        } else {
          console.warn("⚠️ فشل رفع صورة إضافية:", file.name);
        }
      }

      console.log("✅ الصورة الأساسية:", imageUrl);
      console.log("✅ الصور الإضافية:", uploadedMedia);
      const newProduct = await addProduct({
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        price: Number(price),
        oldPrice: Number(oldPrice) || 0,
        imageUrl,
        categoryIds,
        subCategoryIds,
        modelNumber,
        compositionAr,
        compositionEn,
        inspirationAr,
        inspirationEn,
        size,
        gender,
        warrantyAr,
        warrantyEn,
        stock: Number(stock),
        media: uploadedMedia.map((m) => ({
          url: m.url,
          language: m.language,  
        })),
      });

      console.log("✅ المنتج تم حفظه:", newProduct);
      setLoading(false);
      toast.success("✅ تم رفع المنتج بنجاح", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.error("❌ خطأ أثناء الرفع:", error);
      setLoading(false);
      toast.error("⚠️ في مشكلة أثناء الرفع، شوف الكونسول للتفاصيل", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  }


  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  return (
    <div className="mx-80 my-6 mt-10  pt-40">
      <div className="space-y-8 p-9  border rounded">
        <div>

        </div>
        <div className="flex gap-1">
          <Input
            type="text"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            placeholder="اسم المنتج بالعربي"
            className="border p-2 w-full"
          />
          <Input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="اسم المنتج بالانجليزي"
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-1">
          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder="الوصف بالعربي"
            className="border p-2 w-full"
          />
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="الوصف بالانجليزي"
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-1">
          <textarea
            value={compositionAr}
            onChange={(e) => setCompositionAr(e.target.value)}
            placeholder="التركيبة بالعربية"
            className="border p-2 w-full"
          />
          <textarea
            value={compositionEn}
            onChange={(e) => setCompositionEn(e.target.value)}
            placeholder="Composition (English)"
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-1">
          <textarea
            value={inspirationAr}
            onChange={(e) => setInspirationAr(e.target.value)}
            placeholder="مصدر الإلهام بالعربية"
            className="border p-2 w-full"
          />
          <textarea
            value={inspirationEn}
            onChange={(e) => setInspirationEn(e.target.value)}
            placeholder="Inspiration (English)"
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-1">
          <textarea
            value={warrantyAr}
            onChange={(e) => setWarrantyAr(e.target.value)}
            placeholder="الضمان بالعربية"
            className="border p-2 w-full"
          />
          <textarea
            value={warrantyEn}
            onChange={(e) => setWarrantyEn(e.target.value)}
            placeholder="Warranty (English)"
            className="border p-2 w-full"
          />
        </div>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">اختر الجنس</option>
          <option value="Male">رجالي</option>
          <option value="Female">نسائي</option>
          <option value="Unisex">جنسين</option>
        </select>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">اختر الحجم</option>
          <option value="25ml">25ml</option>
          <option value="100ml">100ml</option>
          <option value="150ml">150ml</option>
          <option value="200ml">200ml</option>
          <option value="350ml">350ml</option>

        </select>

        <Input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="الكمية المتاحة"
          className="border p-2 w-full"
        />

        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="السعر"
          className="border p-2 w-full"
        />

        <Input
          type="number"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="السعر القديم (اختياري)"
          className="border p-2 w-full"
        />

        <Input
          type="text"
          value={modelNumber}
          onChange={(e) => setModelNumber(e.target.value)}
          placeholder="رقم الموديل"
          className="border p-2 w-full"
        />

        <CategoryTagSelector
          categories={categories}
          subs={subs}
          categoryIds={categoryIds}
          setCategoryIds={setCategoryIds}
          subCategoryIds={subCategoryIds}
          setSubCategoryIds={setSubCategoryIds}
        />

        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 w-full"
        />

        {previewUrl && (
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={previewUrl}
              alt="Preview"
              width={128}
              height={128}
              className="w-32 h-32 object-cover mt-2 rounded"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl("");
                setImageFile(null);
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMediaChange}
          className="border p-2 w-full"
        />

        <div className="flex gap-2 mt-2 overflow-x-auto">
          {mediaPreviews.map((url, idx) => (
            <div
              key={idx}
              className="relative w-32 h-40 border rounded overflow-hidden flex-shrink-0 flex flex-col"
            >
              <button
                type="button"
                onClick={() => {
                  setMediaPreviews((prev) => prev.filter((_, i) => i !== idx));
                  setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
                  setMediaLanguages((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 z-10"
              >
                <X size={14} />
              </button>

              <Image
                src={url}
                alt={`media-${idx}`}
                width={128}
                height={128}
                className="w-full h-32 object-cover"
              />

              <select
                value={mediaLanguages[idx] || "BOTH"}
                onChange={(e) => handleLanguageChange(idx, e.target.value as "AR" | "EN" | "BOTH")}
                className="w-full bg-white text-xs border-t p-1.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="AR">🇸🇦 عربي</option>
                <option value="EN">🇬🇧 English</option>
                <option value="BOTH">🌍 الاتنين</option>
              </select>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "جاري الحفظ..." : "إضافة المنتج"}
        </Button>
      </div>
    </div>
  );
}

export function CategoryTagSelector({
  categories,
  subs,
  categoryIds,
  setCategoryIds,
  subCategoryIds,
  setSubCategoryIds,
}: {
  categories: Cat[];
  subs: Sub[];
  categoryIds: string[];
  setCategoryIds: (ids: string[]) => void;
  subCategoryIds: string[];
  setSubCategoryIds: (ids: string[]) => void;
}) {
  const toggleCategory = (id: string) => {
    if (categoryIds.includes(id)) {
      setCategoryIds(categoryIds.filter((c) => c !== id));
      setSubCategoryIds(
        subCategoryIds.filter(
          (s) => subs.find((sub) => sub.id === s)?.categoryId !== id
        )
      );
    } else {
      setCategoryIds([...categoryIds, id]);
    }
  };

  const toggleSub = (id: string) => {
    if (subCategoryIds.includes(id)) {
      setSubCategoryIds(subCategoryIds.filter((s) => s !== id));
    } else {
      setSubCategoryIds([...subCategoryIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggleCategory(c.id)}
            className={`px-3 py-1 rounded-full border text-sm ${categoryIds.includes(c.id)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {c.nameAr}
          </button>
        ))}
      </div>

      {categoryIds.length > 0 && (
        <div className="flex flex-wrap gap-2 border rounded p-2">
          {categoryIds.map((id) => {
            const cat = categories.find((c) => c.id === id);
            return (
              <span
                key={id}
                className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
              >
                {cat?.nameAr}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(id)}
                />
              </span>
            );
          })}
        </div>
      )}

      {categoryIds.map((catId) => {
        const cat = categories.find((c) => c.id === catId);
        const relatedSubs = subs.filter((s) => s.categoryId === catId);

        return (
          <div key={catId} className="space-y-2">
            <h4 className="font-semibold">{cat?.nameAr}</h4>
            <div className="flex flex-wrap gap-2">
              {relatedSubs.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSub(s.id)}
                  className={`px-3 py-1 rounded-full border text-sm ${subCategoryIds.includes(s.id)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {s.nameAr}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}