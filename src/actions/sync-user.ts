"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClerkClient } from "@clerk/nextjs/server";

// ✅ clerkClient واحد بس للملف كله
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function syncUserToPrisma() {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "غير مسجل الدخول" };

const primaryEmail = clerkUser.emailAddresses.find(
  (e) => e.id === clerkUser.primaryEmailAddressId
)?.emailAddress;

await db.user.upsert({
  where: {
    clerkId: clerkUser.id,
  },
  update: {
    email: primaryEmail!,
    firstName: (clerkUser.unsafeMetadata?.firstName as string) ?? "",
    lastName: (clerkUser.unsafeMetadata?.lastName as string) ?? "",
    imageUrl: clerkUser.imageUrl,
    phone: (clerkUser.unsafeMetadata?.phone as string) ?? "",
    birthday: clerkUser.unsafeMetadata?.birthday
      ? new Date(clerkUser.unsafeMetadata.birthday as string)
      : null,
    sex: (clerkUser.unsafeMetadata?.sex as string) ?? "",
  },
  create: {
    clerkId: clerkUser.id,
    email: primaryEmail!,
    firstName: (clerkUser.unsafeMetadata?.firstName as string) ?? "",
    lastName: (clerkUser.unsafeMetadata?.lastName as string) ?? "",
    imageUrl: clerkUser.imageUrl,
    phone: (clerkUser.unsafeMetadata?.phone as string) ?? "",
    birthday: clerkUser.unsafeMetadata?.birthday
      ? new Date(clerkUser.unsafeMetadata.birthday as string)
      : null,
    sex: (clerkUser.unsafeMetadata?.sex as string) ?? "",
  },
});
  revalidatePath("/");
  return { success: true };
}

export async function deleteAccountAction() {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "غير مسجل الدخول" };

  try {
    // ✅ بيستخدم الـ clerkClient اللي فوق — مفيش res.ok لأن deleteUser بيرمي error لو فشل
    await clerkClient.users.deleteUser(clerkUser.id);

    await db.user.delete({ where: { clerkId: clerkUser.id } }).catch(() => {});

    revalidatePath("/");
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message || "فشل حذف الحساب" };
  }
}