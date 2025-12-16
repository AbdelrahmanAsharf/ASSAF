

import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import "./[locale]/globals.css";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "700", "900"] });

export default async function NotFound() {
  const locale = (await headers()).get("x-locale") || "ar";  

  const t = {
    ar: {
      title: "نأسف، الرابط غير موجود",
      subtitle: "الرابط المطلوب غير موجود.",
      description: "من فضلك حاول مرة أخرى أو تواصل مع الدعم الفني",
      btnHome: "الذهاب للصفحة الرئيسية",
    },
    en: {
      title: "Sorry, Link Not Found",
      subtitle: "The requested link does not exist.",
      description: "Please try again or contact technical support",
      btnHome: "Go to Home Page",
    },
  };

  const content = locale === "ar" ? t.ar : t.en;

  return (
    <html lang={locale} dir="rtl" className={cairo.className}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-4xl flex flex-col gap-10 w-full text-right">
            <div className="flex items-center gap-12 flex-wrap justify-center lg:justify-start">
              <Image
                src="/icon/b7mx5Vp0dkXgh7M718NYszs9hmwKILfSRIemk0Fl (1).png"
                alt="عساف للعطور"
                width={250}
                height={100}
                priority
                className="drop-shadow-2xl"
              />
              <h1 className="text-8xl font-semibold text-sky-900">410</h1>
            </div>

            <h2 className="text-5xl font-extralight text-gray-300">
              {content.title}
            </h2>

            <div className="text-lg font-extralight text-muted-foreground flex flex-col gap-1">
              <p>{content.subtitle}</p>
              <p>{content.description}</p>
            </div>

            <Link href={`/${locale}`} className="inline-block text-sky-700 text-sm font-medium">
              {content.btnHome}
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}