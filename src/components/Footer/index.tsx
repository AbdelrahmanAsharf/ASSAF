"use client";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl"; 

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale(); 
  const isArabic = locale === "ar";

  const images = [
    "/footer/apple_pay_mini.png",
    "/footer/cod_mini.png",
    "/footer/credit_card_mini.png",
    "/footer/mada_mini.png",
    "/footer/madfu_installment_mini.png",
    "/footer/sbc.png",
    "/footer/stc_pay_mini.png",
    "/footer/tabby_installment_mini.png",
    "/footer/tamara_installment_mini.png",
    "/footer/tax.png"
  ];

  return (
    <div className="bg-black text-white" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex-col lg:flex-row flex gap-10 md:gap-40 md:p-20 p-10">
        <div className={`place-items-center lg:place-items-start ${isArabic ? "text-right" : "text-left"}`}>
          <Image
            src="/footer/footer.png"
            alt="Assaf Logo"
            height={100}
            width={150}
            className="object-cover"
          />
          <p className="md:pt-5 p-4">{t("slogan")}</p>
          
          <div className={`flex  gap-6 ${isArabic ? "items-end" : "items-start"}`}>
            <div className="flex gap-3 items-center">
              <Image src="/footer/commercial-register.png" height={58} width={58} className="object-cover" alt="" />
              <div className={isArabic ? "text-right" : "text-left"}>
                <h2 className="font-normal text-sm">{t("commercialRegister")}</h2>
                <h2 className="text-base font-semibold">{t("commercialNumber")}</h2>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Image src="/footer/tax.png" height={40} width={40} className="object-cover" alt="" />
              <div className={isArabic ? "text-right" : "text-left"}>
                <h3 className="font-normal text-sm">{t("taxRegister")}</h3>
                <h3 className="text-base font-semibold">{t("taxNumber")}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-10 md:gap-20">
          {/* Important Links */}
          <div>
            <h1 className="text-2xl font-bold">{t("importantLinks")}</h1>
            <div className="flex md:gap-10 gap-5 py-5">
              <div className="flex flex-col space-y-2">
                <Link href="/about" className="hover:text-gray-400 text-xs md:text-base">{t("aboutUs")}</Link>
                <Link href="/shipping" className="hover:text-gray-400 text-xs md:text-base">{t("shippingInfo")}</Link>
                <Link href="/privacy" className="hover:text-gray-400 text-xs md:text-base">{t("privacyPolicy")}</Link>
              </div>
              <div className="flex flex-col space-y-2">
                <Link href="/contact" className="hover:text-gray-400 text-xs md:text-base">{t("complaints")}</Link>
                <Link href="/franchise" className="hover:text-gray-400 text-xs md:text-base">{t("franchise")}</Link>
                <Link href="/returns" className="hover:text-gray-400 text-xs md:text-base">{t("returns")}</Link>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h1 className="text-2xl font-bold">{t("contactUs")}</h1>
            <ul className="flex flex-col space-y-3 py-5">
              <Link href="tel:9889892" className="flex items-center gap-2 hover:text-gray-400">
                <Phone className="w-4 h-4" /> {t("phone")}
              </Link>
              <Link href="https://wa.me/201234567890" target="_blank" className="flex items-center gap-2 hover:text-gray-400">
                <MessageCircle className="w-4 h-4" /> {t("whatsapp")}
              </Link>
              <Link href="mailto:info@assaf.com" className="flex items-center gap-2 hover:text-gray-400">
                <Mail className="w-4 h-4" /> info@assaf.com
              </Link>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-dotted border-gray-500"></div>

      <div className="px-5 md:px-20 flex flex-col md:flex-row items-center justify-between gap-6 py-5">
        <h3 className="text-sm text-center md:text-left">{t("copyright")}</h3>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {images.map((src, index) => (
            <div key={index} className="relative w-12 h-8">
              <Image
                src={src}
                alt={`Payment method ${index + 1}`}
                fill
                className="object-contain p-1 bg-white border rounded-sm"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border border-gray-600 rounded-md hover:bg-gray-700">
            <Facebook className="w-4 h-4" />
          </Link>
          <Link href="/" className="p-2 border border-gray-600 rounded-md hover:bg-gray-700">
            <Twitter className="w-4 h-4" />
          </Link>
          <Link href="/" className="p-2 border border-gray-600 rounded-md hover:bg-gray-700">
            <Instagram className="w-4 h-4" />
          </Link>
          <Link href="/" className="p-2 border border-gray-600 rounded-md hover:bg-gray-700">
            <Youtube className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}