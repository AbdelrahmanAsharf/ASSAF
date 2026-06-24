/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/[locale]/layout.tsx

import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {  Poppins, Tajawal } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ClientLayout from "./ClientLayout";
import { getMessages } from "next-intl/server";
import "./globals.css"; 
import { getNavs } from "@/actions/navs";
import { buildNavsFromDB } from "@/lib/slugify";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500",  "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "عساف للعطور | 3saf - إما العظمة أو لا شيء",
  description:
    "عطور عساف الاصلية - عطور سعودية فاخرة بثبات عالي: فيكتوريا، بينك ليدي، عود نجدي. شحن مجاني وتغليف هدايا",
  icons: {
    icon: "/icon/logo.webp",
    shortcut: "/icon/logo.webp",
  },
};


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // تحقق من اللغة
  if (!["ar", "en"].includes(locale)) notFound();

  const dir = locale === "ar" ? "rtl" : "ltr" as const;
  const fontClass = locale === "ar" ? tajawal.variable : poppins.variable;
  const messages = await getMessages();


  const pathname = (await headers()).get("x-pathname") || `/${locale}`;
  (globalThis as any).__NEXT_LOCALE_PATHNAME = pathname;
  const rawNavs = await getNavs();
  const navs = buildNavsFromDB(rawNavs);
  
  return (
    <ClerkProvider>
      <ClientLayout locale={locale} dir={dir} fontClass={fontClass} messages={messages}   navs={navs}
      >
        {children}
      </ClientLayout>
    </ClerkProvider>
  );
}