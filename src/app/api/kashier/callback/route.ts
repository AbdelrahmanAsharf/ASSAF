// src/app/api/kashier/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const API_KEY = process.env.KASHIER_API_KEY!;

/**
 * Verify Kashier webhook signature
 * Kashier sends signature in request header: "signature"
 * We recreate it by sorting the signatureKeys fields alphabetically
 * and generating HMAC-SHA256 using the API_KEY
 */
function verifyKashierSignature(
  data: Record<string, string>,
  signatureKeys: string[],
  receivedSignature: string
): boolean {
  // Sort keys alphabetically and build the payload string
  const sortedKeys = [...signatureKeys].sort();
  const payloadParts = sortedKeys.map((key) => `${key}=${data[key]}`);
  const payload = payloadParts.join("&");

  const expectedSignature = crypto
    .createHmac("sha256", API_KEY)
    .update(payload)
    .digest("hex")
    .toLowerCase();

  return expectedSignature === receivedSignature?.toLowerCase();
}

// GET: handles redirect callback from Kashier Hosted Payment Page
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("paymentStatus") || searchParams.get("status");
  const orderId = searchParams.get("merchantOrderId") || searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const transactionId = searchParams.get("transactionId");
  const signature = searchParams.get("signature");
  const signatureKeys = searchParams.get("signatureKeys")?.split(",") || [];

  const locale = searchParams.get("locale") || "ar";

  if (!signature || !signatureKeys.length) {
    return NextResponse.redirect(
      new URL(`/${locale}/payment-failed?reason=invalid_signature`, req.url)
    );
  }

  // Build data object from query params for verification
  const data: Record<string, string> = {};
  signatureKeys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) data[key] = val;
  });

  const isValid = verifyKashierSignature(data, signatureKeys, signature);

  if (!isValid) {
    console.error("Kashier signature mismatch", { orderId, transactionId });
    return NextResponse.redirect(
      new URL(`/${locale}/payment-failed?reason=signature_mismatch`, req.url)
    );
  }

  if (status === "SUCCESS") {
    return NextResponse.redirect(
      new URL(
        `/${locale}/success?order=${orderId}&amount=${amount}&transactionId=${transactionId}`,
        req.url
      )
    );
  } else {
    return NextResponse.redirect(
      new URL(`/${locale}/payment-failed?reason=${status}&order=${orderId}`, req.url)
    );
  }
}

// POST: handles server-to-server webhook from Kashier
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, signatureKeys } = body;
    const receivedSignature = req.headers.get("signature") || body.signature;

    if (!receivedSignature || !signatureKeys?.length) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const isValid = verifyKashierSignature(data, signatureKeys, receivedSignature);

    if (!isValid) {
      console.error("Kashier webhook signature invalid", body);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { status, merchantOrderId, amount, currency, transactionId } = data;

    console.log("Kashier Webhook Received:", {
      status,
      merchantOrderId,
      amount,
      currency,
      transactionId,
    });

    // ✅ هنا تعمل أي حاجة بعد تأكيد الدفع:
    // - تحدث الأوردر في الداتابيز
    // - ترسل إيميل للكاستومر
    // - إلخ...

    if (status === "SUCCESS") {
      // await updateOrderStatus(merchantOrderId, "paid");
      console.log(`✅ Order ${merchantOrderId} paid successfully`);
    } else {
      console.log(`❌ Order ${merchantOrderId} payment failed: ${status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Kashier webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}