/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { useCart } from "@/store/cart-store";
import { useToast } from "@/utils/toast";
import { Minus, Plus, SaudiRiyal, ShoppingBag, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { UserS, type UserSRef } from "@/components/header/user";

export default function Cart() {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };
  const t = useTranslations("cart");
  const toast = useToast();
  const crumbs = [{ title: t("title") }];

  const { user, isLoaded } = useUser();

  const { items, changeQty, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);


  const userDialogRef = useRef<UserSRef>(null);

  const handleCheckout = async () => {
    if (!isLoaded) return;

    
    if (!user) {
      
      userDialogRef.current?.openDialog();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount * 100,
          username: user.firstName || "مستخدم",
        }),
      });

      const { clientSecret } = await res.json();

      const cartData = JSON.stringify(items.map(i => ({
        id: i.id,
        title: i.title,
        image: i.image,
        price: i.price,
        qty: i.qty,
        total: i.price * i.qty
      })));

      router.push(`/checkout?secret=${clientSecret}&amount=${totalAmount}&cart=${encodeURIComponent(cartData)}`);
    } catch (err) {
      toast.error("paymentFailed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 lg:pt-35 mt-10">
      <div className="bg-gray-100 pt-5 ">
        <Breadcrumbs crumbs={crumbs} />
        {items.length > 0 ? (
          <div className="flex gap-5 flex-col lg:flex-row container">
            <div className="flex lg:w-3/4 md:w-full flex-col">
              {items.map((item) => (
                <div key={item.id} className="relative flex flex-col md:items-center md:pl-20 md:pb-6 md:pr-5 p-2 md:flex-row md:justify-between border mb-8 bg-white border-black rounded-sm">
                  <div className="flex gap-3 pt-9 md:pt-3">
                    <div className="border rounded-sm p-1 flex-shrink-0">
                      <Image
                        alt={item.title}
                        src={item.image}
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px] object-cover rounded"
                      />
                    </div>
                    <div className="pt-2">
                      <h2 className="font-bold text-sm">{item.title}</h2>
                      <div className="flex gap-1">
                        {item.oldprice * item.qty > 0 && (
                          <div className="flex items-center line-through">
                            <h2 className="text-sm">{item.oldprice * item.qty}</h2>
                            <SaudiRiyal className="w-3 h-3" />
                          </div>
                        )}
                        <div className="flex items-center text-red-400">
                          <h2 className="font-normal">{item.price * item.qty}</h2>
                          <SaudiRiyal className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-8 border-t-2 border-b-2 py-4 my-4 md:border-0 md:py-0 md:my-0">
                    <div className="flex items-start">
                      <span
                        className="cursor-pointer border rounded-r-md px-3 py-2"
                        onClick={() => {
                          changeQty(item.id, "inc");
                          toast.success("updateCartItem");
                        }}
                      >
                        <Plus />
                      </span>
                      <span className="cursor-auto border py-2 font-semibold px-4">{item.qty}</span>
                      <span
                        className="cursor-pointer border rounded-l-md py-2 px-3"
                        onClick={() => {
                          changeQty(item.id, "dec");
                          toast.success("updateCartItem");
                        }}
                      >
                        <Minus />
                      </span>
                    </div>
                    <div className="flex items-start">
                      <h2>{locale === "ar" ? "المجموع:" : "Total:"}</h2>
                      <div className="flex items-center">
                        <h2 className="font-medium text-base">{item.price * item.qty}</h2>
                        <SaudiRiyal className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success("removeFromCart");
                    }}
                    className="absolute top-2 left-2 md:left-4 lg:left-6 p-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition z-10 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white lg:w-1/4 md:w-full h-fit rounded-sm p-6">
              <div className="border-b-1">
                <h2 className="font-medium text-sm">{t("orderSummary")}</h2>
                <div className="flex justify-between py-5 items-center">
                  <h3 className="font-normal text-sm">{t("subtotal")}</h3>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-base">
                      {items.reduce((sum, i) => sum + i.price * i.qty, 0)}
                    </h3>
                    <SaudiRiyal className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="border-b-1">
                <div className="py-5 items-center">
                  <h3 className="font-normal text-sm">{t("haveCoupon")}</h3>
                  <div className="items-center flex mt-3">
                    <Input
                      type="text"
                      placeholder={t("enterCoupon")}
                      className="rounded-r-sm rounded-l-none focus-visible:ring-0 py-4.5 focus-visible:border-black"
                    />
                    <span className="rounded-l-sm bg-black text-gray-300 px-4 py-2 font-medium">
                      {t("apply")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between py-5 items-center">
                <h3 className="font-normal text-base">{t("total")}</h3>
                <div className="flex items-center">
                  <h3 className="font-semibold text-base">
                    {items.reduce((sum, i) => sum + i.price * i.qty, 0)}
                  </h3>
                  <SaudiRiyal className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-xs">{t("taxIncluded")}</span>
                <Button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full mt-4 rounded-sm py-6 font-bold text-base bg-black cursor-pointer hover:bg-black"
                >
                  {loading ? <Spinner /> : t("checkout")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 py-25">
            <div className="rounded-full bg-blue-50/50 p-15">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-gray-400">{t("empty")}</h2>
            <Link
              href="/"
              className="rounded-4xl border px-5 py-2 font-medium border-black transition-colors duration-300 hover:bg-stone-700 hover:text-gray-300"
            >
              {t("backHome")}
            </Link>
          </div>
        )}
      </div>

      
      <div className="hidden">
        <UserS ref={userDialogRef} />
      </div>
    </div>
  );
}