// src/app/[locale]/payment-failed/page.tsx
"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const { locale } = useParams() as { locale: string };
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {locale === "ar" ? "فشل الدفع" : "Payment Failed"}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {locale === "ar"
            ? "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى."
            : "Something went wrong during payment processing. Please try again."}
        </p>
        {reason && (
          <p className="text-xs text-red-400 mb-4 bg-red-50 rounded-lg p-3">
            {locale === "ar" ? `السبب: ${reason}` : `Reason: ${reason}`}
          </p>
        )}
        <div className="flex gap-3 flex-col">
          <Link
            href={`/${locale}/cart`}
            className="inline-block bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            {locale === "ar" ? "العودة للسلة" : "Back to Cart"}
          </Link>
          <Link
            href={`/${locale}`}
            className="text-sm text-gray-400 hover:underline"
          >
            {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}