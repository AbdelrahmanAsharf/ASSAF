// app/admin/layout.tsx
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import "@/app/[locale]/globals.css";
import { AdminSidebar } from "./AdminSidebar";
import { ToastContainer } from "react-toastify";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/");

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    select: { role: true, firstName: true, lastName: true },
  });

  if (user?.role !== "ADMIN") redirect("/");

  return (
    <html lang="ar" dir="rtl">
      <body>
        <ToastContainer position="top-right" autoClose={3000} rtl />
        <div className="flex min-h-screen bg-[#F7F7F7] font-sans">
          <AdminSidebar user={user} />
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
