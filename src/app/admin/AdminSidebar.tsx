/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// app/admin/AdminSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  LayoutGrid,
  Package,
  ChevronLeft,
  Store,
} from "lucide-react";

const links = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "المستخدمين", icon: Users },
  { href: "/admin/categories", label: "الأقسام", icon: LayoutGrid },
  { href: "/admin/products", label: "المنتجات", icon: Package },
];

export function AdminSidebar({
  user,
}: {
  user: { firstName?: string | null; lastName?: string | null };
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-l border-gray-100 flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">عساف للعطور</p>
            <p className="text-xs text-gray-400">لوحة التحكم</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link: any) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
              {active && <ChevronLeft className="w-3.5 h-3.5 mr-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.firstName?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-400">مشرف</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-2 flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          العودة للموقع
        </Link>
      </div>
    </aside>
  );
}