import AddProductForm from "@/components/addproduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/prisma";

export default async function AddProductPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const { password } = await searchParams;

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!password || password !== ADMIN_PASSWORD) {
    return (
      <div className=" pt-40 mt-10 px-150 pb-10">

        <h1>أدخل كلمة المرور للوصول للصفحة</h1>
        <p>أدخل الرابط مع كلمة السر الصحيحة أو استخدم الفورم أدناه</p>

        <form method="GET" className="flex flex-col gap-2 mt-10">
          <Input id="password" name="password" type="password" required />
          <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
            دخول
          </Button>
        </form>

      </div>
    );
  }

  const categories = await db.category.findMany({
    select: { id: true, nameAr: true },
  });

  const subs = await db.subCategory.findMany({
    select: { id: true, nameAr: true, categoryId: true }, 
  });

  return <AddProductForm categories={categories} subs={subs} />;
}
