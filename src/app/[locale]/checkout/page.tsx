/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/[locale]/checkout/page.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { SaudiRiyal } from "lucide-react";
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/utils/toast";
import { useCart } from "@/store/cart-store";
import { createOrder } from "@/actions/order-actions";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { locale } = useParams() as { locale: string };
    const searchParams = useSearchParams();
    const clientSecret = searchParams.get("secret");
    const amount = searchParams.get("amount");
    const cartParam = searchParams.get("cart");
    const t = useTranslations("checkout");
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    const isRtl = locale === "ar";

    let cartItems: Array<{
        id: string;
        title: string;
        image: string;
        price: number;
        qty: number;
        total: number;
    }> = [];

    if (cartParam) {
        try {
            cartItems = JSON.parse(decodeURIComponent(cartParam));
        } catch (e) {
            console.error("Failed to parse cart data");
        }
    }

    if (!isLoaded || !user || !clientSecret || !amount) {
        window.location.href = `/${locale}/cart`;
        return null;
    }

    const appearance = {
        theme: "flat" as const,
        variables: {
            colorPrimary: "#000000",
            colorBackground: "bg-gray-600",
            colorText: "#000000",
            fontFamily: "Arabic, sans-serif",
            borderRadius: "8px",
        },
    };

    return (
        <div className="min-h-screen py-10 px-4  bg-gray-100">
            <div className="max-w-4xl mx-auto">
                {cartItems.length > 0 && (
                    <>
                        <div className="bg-white rounded-sm   text-center">
                            <div className="flex gap-3 items-center border-b-1 p-4">
                                <div className="border border-gray-400 rounded-sm">
                                    <Image
                                        src="/icon/b7mx5Vp0dkXgh7M718NYszs9hmwKILfSRIemk0Fl (1).png"
                                        alt="kjk"
                                        width={120}
                                        height={120}
                                        className="py-4 px-2"
                                    />
                                </div>
                                <div>
                                    <div>
                                        <h2 className="font-medium text-lg text-gray-800">{user.fullName}</h2>
                                    </div>
                                    <div className="flex gap-2 text-xs pt-2">
                                        <Link href="/cart" className="text-gray-400">{t("orderFrom")}</Link>
                                        <span>/</span>
                                        <span className="text-gray-700">{t("paymentDetails")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex-col gap-4 flex">
                                <div className="flex justify-between items-center text-xl font-semibold">
                                    <h2>{t("orderSummary")}</h2>
                                    <div className="flex items-center gap-1">
                                        <span>{amount}</span>
                                        <SaudiRiyal className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2 ">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className=" p-1 rounded-full border">
                                                {/* الصورة */}
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={20}
                                                    height={20}
                                                    className="w-5 h-5 object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setShowCoupon(!showCoupon)}
                                        className="text-sm font-normal text-red-400 cursor-pointer transition hover:underline"
                                    >
                                        {t("haveCoupon")}
                                    </button>

                                </div>
                                {showCoupon && (
                                    <div className=" w-full animate-in fade-in slide-in-from-top-2 duration-300">

                                        <div className="items-center flex">
                                            <Input
                                                type="text"
                                                placeholder={t("enterCoupon")}
                                                className="rounded-r-sm rounded-l-none focus-visible:ring-0" />
                                            <span className="rounded-l-sm  bg-black text-white px-4 py-2 font-normal text-sm">
                                                {t("apply")}
                                            </span>
                                        </div>
                                    </div>
                                )}

                            </div>


                        </div>
                        <Sheet>
                            <div className="flex items-center justify-center my-4">
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-25 rounded-3xl cursor-pointer font-normal text-xs flex items-center border border-gray-300 hover:bg-white hover:border-gray-400">
                                        {t("orderDetails")}
                                    </Button>
                                </SheetTrigger>
                            </div>
                            <SheetContent side={isRtl ? "right" : "left"} className="flex flex-col h-full p-0">
                                {/* العنوان */}
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle>{t("orderDetails")}</SheetTitle>
                                </SheetHeader>

                                {/* قائمة المنتجات - تتسكرول لو كتير */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="border-t pt-4 first:border-t-0">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.title}
                                                            width={48}
                                                            height={48}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                        <span className="absolute -top-2 -right-2  text-black shadow-sm text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                            {item.qty}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-medium text-sm">{item.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold">{item.total}</span>
                                                    <SaudiRiyal className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <SheetFooter className="border-t text-gray-600 py-10">
                                    <div className="flex justify-between w-full text-xl font-semibold">
                                        <span>{t("total")}</span>
                                        <div className="flex items-center gap-1">
                                            <span>{amount}</span>
                                            <SaudiRiyal className="w-5 h-5" />
                                        </div>
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </>
                )}
                <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance, locale: locale as "ar" | "en" }}
                >
                    <CheckoutForm
                        loading={loading}
                        setLoading={setLoading}
                        locale={locale}
                        clientSecret={clientSecret}
                        amount={amount}
                        cartItems={cartItems}
                    />
                </Elements>
            </div>
        </div>
    );
}



function CheckoutForm({
    loading,
    setLoading,
    locale,
    clientSecret,
    amount,
    cartItems,
}: {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    locale: string;
    clientSecret: string;
    amount: string;
    cartItems: Array<{
        id: string;
        title: string;
        image: string;
        price: number;
        qty: number;
        total: number;
    }>;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const t = useTranslations("checkout");
    const toast = useToast();
    const { clearCart } = useCart();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);
        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card },
        });

        if (error) {
            toast.raw.error(error.message ?? t("paymentFailed"));
        } else if (paymentIntent?.status === "succeeded") {
            toast.success("toast.paymentSuccess");

            try {
        
                const order = await createOrder(
                    cartItems.map(i => ({
                        productId: i.id,
                        quantity: i.qty,
                    }))
                );

                
                clearCart();

                
                window.location.href = `/${locale}/success?order=${order.id}&amount=${amount}`;
            } catch (err: any) {
                toast.raw.error(err.message || "فشل حفظ الطلب");
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">{t("cardInfo")}</label>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <CardElement options={{ style: { base: { fontSize: "16px", color: "#000" } } }} />
                </div>
            </div>
            <Button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-black cursor-pointer text-white py-6 rounded-xl text-lg font-bold"
            >
                {loading ? <Spinner /> : t("payNow")}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">{t("securePayment")}</p>
        </form>
    );
}