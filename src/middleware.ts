import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: "always",
  pathnames: { "/api": "/api" }
});

const protectedPaths = new Set([
  "profile",
  "pending_orders",
  "orders",
  "notifications",
  "wishlist"
]);

// middleware.ts
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const url = req.nextUrl;
  const pathname = url.pathname;

  if (pathname.startsWith("/api")) return NextResponse.next();

  // ✅ Admin check بالـ API route
  if (pathname.startsWith("/admin")) {
    if (!userId) return NextResponse.redirect(new URL("/", req.url));

    const res = await fetch(`${url.origin}/api/check-admin?clerkId=${userId}`, {
      // ✅ مهم — يمنع infinite loop
      headers: { "x-internal": "true" },
    });
    const { isAdmin } = await res.json();

    if (!isAdmin) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  const hasLocale = pathname.startsWith("/ar") || pathname.startsWith("/en");
  if (!hasLocale) return NextResponse.redirect(new URL(`/ar${pathname}`, req.url));

  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

  const firstSegment = pathWithoutLocale.split("/")[1] || "";
  if (protectedPaths.has(firstSegment) && !userId) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    "/(api|ar|en|admin)/:path*", 
  ],
};
