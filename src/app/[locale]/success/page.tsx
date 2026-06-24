// src/app/[locale]/success/page.tsx
"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/store/cart-store";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const { locale } = useParams() as { locale: string };
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get("order");
  const amount = searchParams.get("amount");
  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    // Clear cart on success (callback already verified signature server-side)
    clearCart();

    // Optionally save order to your DB here if not done in webhook
    // (Webhook is more reliable — prefer doing it there)
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {locale === "ar" ? "تم الدفع بنجاح! 🎉" : "Payment Successful! 🎉"}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {locale === "ar"
            ? `رقم الطلب: ${orderId}`
            : `Order ID: ${orderId}`}
        </p>
        {transactionId && (
          <p className="text-gray-400 text-xs mb-6">
            {locale === "ar"
              ? `رقم المعاملة: ${transactionId}`
              : `Transaction ID: ${transactionId}`}
          </p>
        )}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            {locale === "ar" ? "المبلغ المدفوع" : "Amount Paid"}
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {amount} {locale === "ar" ? "ج.م" : "EGP"}
          </p>
        </div>
        <Link
          href={`/${locale}`}
          className="inline-block bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
        >
          {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}