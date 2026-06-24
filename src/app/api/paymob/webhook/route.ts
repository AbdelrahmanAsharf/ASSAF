/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/paymob/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ─────────────────────────────────────────────
// ✅ التحقق من HMAC — أهم خطوة أمنية
// بدون ده أي حد يقدر يبعتلك "تم الدفع" وهمي
// ─────────────────────────────────────────────
function verifyHmac(obj: any, receivedHmac: string): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET!;

  // الترتيب ده ثابت ومحدد من Paymob نفسها — متغيروش الترتيب
  const orderedKeys = [
    "amount_cents",
    "created_at",
    "currency",
    "error_occured",
    "has_parent_transaction",
    "id",
    "integration_id",
    "is_3d_secure",
    "is_auth",
    "is_capture",
    "is_refunded",
    "is_standalone_payment",
    "is_voided",
    "order.id",
    "owner",
    "pending",
    "source_data.pan",
    "source_data.sub_type",
    "source_data.type",
    "success",
  ];

  const concatenated = orderedKeys
    .map((key) => {
      const keys = key.split(".");
      let value = obj;
      for (const k of keys) value = value?.[k];
      return value;
    })
    .join("");

  const calculatedHmac = crypto
    .createHmac("sha512", hmacSecret)
    .update(concatenated)
    .digest("hex");

  return calculatedHmac === receivedHmac;
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const receivedHmac = url.searchParams.get("hmac");
    const body = await req.json();
    const transaction = body.obj;

    if (!receivedHmac || !verifyHmac(transaction, receivedHmac)) {
      console.error("❌ HMAC غير صحيح — محاولة مشبوهة");
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
    }

    const success = transaction.success;
    const paymobOrderId = transaction.order?.id;

    if (!success) {
      console.log("⚠️ معاملة فشلت:", paymobOrderId);
      return NextResponse.json({ received: true });
    }

    // ✅ هنا تأكيد الطلب في الـ DB بتاعتك
    // مهم: استخدم paymobOrderId اللي خزنته وانت بتنشئ الطلب
    // مثال — لو عندك حقل paymobOrderId في جدول Order:

    // await db.order.update({
    //   where: { paymobOrderId: String(paymobOrderId) },
    //   data: { status: "PAID" },
    // });

    console.log("✅ تم تأكيد الدفع لـ Order:", paymobOrderId);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}