// src/actions/get-role.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getMyRole() {
  const { userId } = await auth();
  if (!userId) return "USER";

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return user?.role ?? "USER";
}