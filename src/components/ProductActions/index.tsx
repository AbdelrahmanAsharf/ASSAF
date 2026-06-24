// components/ProductActions.tsx
"use client";

import { useCart } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, SaudiRiyal } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/utils/toast";

interface ProductActionsProps {
  id: string;
  price: number;
  oldPrice: number;
  stock: number;
  title: string;
  image: string;
}

export default function ProductActions({
  id,
  price,
  oldPrice,
  stock,
  title,
  image,
}: ProductActionsProps) {
  const [dialogQty, setDialogQty] = useState(1);


  const handleInc = () => setDialogQty(dialogQty + 1);
  const handleDec = () => setDialogQty(Math.max(1, dialogQty - 1));
  const toast = useToast();
  const handleAddToCart = () => {
    addItem({ id, title, price, oldprice: oldPrice, image, qty: dialogQty, stock });
    localStorage.setItem("selectedCat", "cart");
    toast.success("addtocart");
  };

  const { addItem } = useCart();
const t = useTranslations("ProductActions");

  return (
    <div className="space-y-4">
      
      {/* العداد والسعر */}
      <div className="flex justify-between items-center w-full">
        <p>{t("price")}</p>
        <div className="  pb-4">
          <div className="flex items-center gap-2 pt-3">
            <div className="flex items-center text-red-400">
              <h2 className="font-semibold text-lg">{dialogQty * price}</h2>
              <SaudiRiyal className="w-5 h-5" />
            </div>
            {oldPrice > 0 && (
              <div className="flex items-center line-through">
                <h2 className="text-base">{dialogQty * oldPrice}</h2>
                <SaudiRiyal className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>


      {/* العداد */}
      <div className="flex justify-between  items-center  w-full">
        <p>{t("quantity")}</p>
        <div className="flex">
          <span
            className="px-3 border py-2 cursor-pointer hover:bg-gray-100"
            onClick={handleInc}
          >
            <Plus />
          </span>
          <span className="border-y px-4 py-2 cursor-auto min-w-12.5 text-center">
            {dialogQty}
          </span>
          <span
            className="px-3 border py-2 cursor-pointer hover:bg-gray-100"
            onClick={handleDec}
          >
            <Minus />
          </span>
        </div>

      </div>

      {/* زر الإضافة للسلة */}
      <Button
        className="w-full bg-gray-800 mb-9 rounded-xs cursor-pointer hover:bg-gray-800 text-white h-12 text-lg"
        disabled={stock === 0}
        onClick={handleAddToCart}

      >
        <ShoppingCart className="w-6 h-6 ml-2" />

      </Button>
    </div>
  );
}