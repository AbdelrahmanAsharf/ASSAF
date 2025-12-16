
"use server";

import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function checkEmailExists(email: string): Promise<{ exists: boolean }> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await clerkClient.users.getUserList({
      emailAddress: [normalizedEmail],
    });
    return { exists: users.data.length > 0 };
  } catch (error) {
    console.error("خطأ في فحص الإيميل:", error);
    return { exists: false };
  }
}