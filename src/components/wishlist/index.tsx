/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWishlist } from "@/store/cart-store";
import { useCart } from "@/store/cart-store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Heart, SaudiRiyal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { slugify } from "@/lib/slugify";
import { CartItem } from "@/store/cart-store";
import { useToast } from "@/utils/toast";

export default function WishlistContent() {
    const t = useTranslations("card");
    const t1 = useTranslations("toast");

    const { items, removeItem } = useWishlist();
    const { addItem } = useCart();

    const toast = useToast();

    const handleAddToCart = (item: CartItem) => {
        if (item.stock <= 0) {
            toast.error(t1("outOfStock"));
            return;
        }

        addItem({ ...item, qty: 1 });
        localStorage.setItem("selectedCat", "cart");
        toast.success(t1("addtocart"));
    };

    const handleRemoveFromWishlist = (id: string) => {
        removeItem(id);
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center gap-5 py-25 ">
                <div className="rounded-full bg-indigo-50 p-15">
                    <Heart className="w-15 h-15 text-gray-400 " />
                </div>
                <h2 className="text-gray-400"> الأمنيات غالباً تتحقق !</h2>
            </div>
        );
    }

    return (
        <div className="mx-60">
            {items.map((item: any) => {
                const stock = item.stock;

                return (
                    <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative h-25 w-25 overflow-hidden rounded">
                                <Link href={`/${slugify(item.title)}/${item.id}`}>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-contain p-2 transition-transform group-hover:scale-105"
                                    />
                                </Link>
                            </div>

                            <div>
                                <h2 className="font-bold text-sm line-clamp-1">{item.title}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center text-red-500">
                                        <span className="font-semibold text-sm">{item.price}</span>
                                        <SaudiRiyal className="w-4 h-4 ml-1" />
                                    </div>
                                    {item.oldprice > 0 && (
                                        <div className="flex items-center line-through text-gray-500">
                                            <span className="text-sm">{item.oldprice}</span>
                                            <SaudiRiyal className="w-3 h-3 ml-1" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                className="w-full font-bold text-sm rounded-sm pt-5 pb-6 px-9 cursor-pointer border-black border bg-gray-300 hover:border-gray-300 hover:bg-gray-300 text-green-950"
                                disabled={stock === 0}
                                onClick={() => handleAddToCart(item)}
                            >
                                {stock > 0 ? t("subscribe") : t("outOfStock")}
                            </Button>
                            <button
                                className="p-1 bg-red-400 text-white rounded-full hover:bg-red-500 cursor-pointer"
                                onClick={() => handleRemoveFromWishlist(item.id)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}