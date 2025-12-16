/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/delete-account.ts
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteAccountAction() {
  
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "المستخدم غير مسجل الدخول" };
  }

  try {
    
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!clerkResponse.ok) {
      const errorText = await clerkResponse.text();
      throw new Error(`فشل حذف الحساب من Clerk: ${errorText}`);
    }

    
    try {
      await db.user.delete({
        where: { clerkId: userId },
      });
    } catch (prismaError) {
      console.warn("المستخدم مش موجود في Prisma أو اتحذف قبل كده:", prismaError);
      
    }

    revalidatePath("/");
    return { success: true };

  } catch (error: any) {
    console.error("خطأ كامل في حذف الحساب:", error);
    return {
      success: false,
      error: error.message || "فشل حذف الحساب، حاول مرة أخرى",
    };
  }
}