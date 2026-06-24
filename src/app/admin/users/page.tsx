// app/admin/users/page.tsx
import { db } from "@/lib/prisma";
import { ChangeRoleButton } from "./ChangeRoleButton";

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">المستخدمين</h1>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {users.length} مستخدم
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="p-4 font-medium">المستخدم</th>
              <th className="p-4 font-medium">الإيميل</th>
              <th className="p-4 font-medium">الهاتف</th>
              <th className="p-4 font-medium">الطلبات</th>
              <th className="p-4 font-medium">تاريخ التسجيل</th>
              <th className="p-4 font-medium">الدور</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-medium text-gray-800">{u.firstName} {u.lastName}</p>
                </td>
                <td className="p-4 text-gray-600 text-sm">{u.email}</td>
                <td className="p-4 text-gray-600 text-sm">{u.phone || "—"}</td>
                <td className="p-4 text-gray-600 text-sm">{u._count.orders}</td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                </td>
                <td className="p-4">
                  <ChangeRoleButton userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}