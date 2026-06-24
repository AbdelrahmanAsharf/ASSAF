import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

const MERCHANT_ID = process.env.KASHIER_MERCHANT_ID!;
const SECRET_KEY = process.env.KASHIER_HPP_SECRET_KEY!;

function generateKashierHash(orderId: string, amount: string, currency: string) {
  const path = `/?payment=${MERCHANT_ID}.${orderId}.${amount}.${currency}`;
  return crypto.createHmac("sha256", SECRET_KEY).update(path).digest("hex").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency = "EGP", cartItems } = body;

    if (!amount || !cartItems?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ تأكد إن الـ User موجود في الداتابيز
    const clerkUser = await currentUser();
    const dbUser = await db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        firstName: clerkUser?.firstName ?? "",
        lastName: clerkUser?.lastName ?? "",
        phone: "",
        imageUrl: clerkUser?.imageUrl ?? "",
      },
    });

    // ✅ إنشاء الأوردر بـ id الـ User من الداتابيز
    const order = await db.order.create({
      data: {
        userId: dbUser.id,
        status: "PENDING",
        products: {
          create: cartItems.map((item: { id: string; qty: number }) => ({
            productId: item.id,
            quantity: item.qty,
          })),
        },
      },
      include: { products: true },
    });

    const formattedAmount = Number(amount).toFixed(2);
    const hash = generateKashierHash(order.id, formattedAmount, currency);

    return NextResponse.json({
      orderId: order.id,
      amount: formattedAmount,
      currency,
      hash,
      merchantId: MERCHANT_ID,
    });

  } catch (error) {
    console.error("Kashier create-order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}