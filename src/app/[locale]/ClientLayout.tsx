// src/app/[locale]/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { Bounce, ToastContainer } from "react-toastify";
import ScrollCircle from "@/components/ScrollCircle/ScrollCircle";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { NavItem } from "@/types/nav";

type Dir = "rtl" | "ltr";

export default function ClientLayout({
  children,
  locale,
  dir,
  fontClass,
  messages,
  navs,
}: {
  children: ReactNode;
  locale: string;
  dir: Dir;
  fontClass: string;
  messages: AbstractIntlMessages;
   navs: NavItem[];
}) {
  const pathname = usePathname();
  const isCheckout = pathname?.includes("/checkout");

  return (
    <html lang={locale} dir={dir} className={fontClass} suppressHydrationWarning>
      <body className="relative min-h-screen">


        <NextIntlClientProvider locale={locale} messages={messages}>
          {isCheckout ? (
            children
          ) : (
            <>
              <ToastContainer
                position={dir === "rtl" ? "top-right" : "top-left"}
                autoClose={5000}
                rtl={dir === "rtl"}
                theme="colored"
                transition={Bounce}
              />
              <Header dir={dir} locale={locale} navs={navs } />
              <main>{children}</main>
              <ScrollCircle dir={dir} />
              <Footer />
            </>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}