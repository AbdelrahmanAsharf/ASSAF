/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/page.tsx
import { db } from "@/lib/prisma";
import { Users, ShoppingBag, LayoutGrid, Package } from "lucide-react";

export default async function AdminDashboard() {
  const [usersCount, productsCount, categoriesCount, ordersCount] =
    await Promise.all([
      db.user.count(),
      db.product.count(),
      db.category.count(),
      db.order.count(),
    ]);

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "المستخدمين", value: usersCount, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "المنتجات", value: productsCount, icon: Package, color: "bg-green-50 text-green-600" },
    { label: "الأقسام", value: categoriesCount, icon: LayoutGrid, color: "bg-purple-50 text-purple-600" },
    { label: "الطلبات", value: ordersCount, icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s: any) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-gray-700">آخر المستخدمين</h2>
        </div>
        <div className="divide-y">
          {recentUsers.map((u: any) => (
            <div key={u.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{u.firstName} {u.lastName}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                u.role === "ADMIN" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
              }`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}