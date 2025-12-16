/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function syncUserToPrisma() {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "غير مسجل الدخول" };

  const primaryEmail = clerkUser.emailAddresses.find(
    e => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: primaryEmail ?? null,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
      
    },
    create: {
      clerkId: clerkUser.id,
      email: primaryEmail ?? null,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
    },
  });

  revalidatePath("/");
  return { success: true };
}


export async function deleteAccountAction() {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "غير مسجل الدخول" };

  try {
    
    const res = await fetch(`https://api.clerk.com/v1/users/${clerkUser.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("فشل حذف الحساب من Clerk");

    
    await db.user.delete({ where: { clerkId: clerkUser.id } }).catch(() => {});

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل حذف الحساب" };
  }
}