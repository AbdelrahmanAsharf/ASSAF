"use server";

import { db } from "@/lib/prisma";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getPrismaUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("غير مصرح");

  return await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      imageUrl: clerkUser.imageUrl ?? "",
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      imageUrl: clerkUser.imageUrl ?? "",
      phone: "",
    },
  });
}

export async function createOrder(
  products: { productId: string; quantity: number }[],
  locale: "ar" | "en" = "ar",
) {
  const user = await getPrismaUser();

  const productIds = products.map((p) => p.productId);
  const dbProducts = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, stock: true, nameAr: true, nameEn: true },
  });

  // ✅ الحل: استخرج الـ type من نتيجة الـ query مباشرة
  type DbProduct = (typeof dbProducts)[number];

  for (const item of products) {
    const product = dbProducts.find((p: DbProduct) => p.id === item.productId);
    if (!product) throw new Error(`المنتج غير موجود: ${item.productId}`);
    if (product.stock < item.quantity) {
      throw new Error(
        locale === "ar"
          ? `الكمية المطلوبة غير متوفرة لـ "${product.nameAr || product.nameEn}" (متوفر: ${product.stock})`
          : `Not enough stock for "${product.nameEn || product.nameAr}" (available: ${product.stock})`,
      );
    }
  }

  const order = await db.$transaction(async (tx: Parameters<Parameters<typeof db.$transaction>[0]>[0]) => {
    const newOrder = await tx.order.create({
      data: {
        userId: user.id,
        products: {
          create: products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                nameAr: true,
                nameEn: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    for (const item of products) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  });

  revalidatePath("/[locale]/orders");
  revalidatePath("/[locale]/products/[id]");
  return order;
}

export async function getUserOrders() {
  const user = await getPrismaUser();

  return await db.order.findMany({
    where: { userId: user.id },
    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}