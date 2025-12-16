"use client"
import Image from "next/image";
import { Barcode, CircleCheck, CircleX, Eye, Heart, Minus, Plus, SaudiRiyal, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useCart, useWishlist } from "@/store/cart-store"; // 🟢 استدعاء الستيت
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"
import { CartItem } from "@/store/cart-store";
import { Link } from "@/i18n/navigation";
import { slugify } from "@/lib/slugify";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/utils/toast";


interface ProductCardProps {
  id: string;
  stableId: string;
  image: string;
  titleAr: string;
  titleEn: string;
  price: number;
  oldprice: number;
  modelnumber: string | number | null;
  stock: number;
  onSubscribe?: () => void;
  category?: string;   
  sub?: string;
}

export default function ProductCard({
  id,
  stableId,
  image,
  titleAr,
  titleEn,
  price,
  oldprice,
  modelnumber,
  stock,

}: ProductCardProps) {
  const locale = useLocale();
  const title = locale === "ar" ? titleAr : titleEn;
  const t = useTranslations("card");

  const { isSignedIn } = useAuth(); 
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();


  const inWishlist = isInWishlist(id);
  const toast = useToast();
  const handleWishlistToggle = () => {
    if (!isSignedIn) {
      toast.error(("loginRequired"));
      return; 
    }
    if (inWishlist) {
      
      removeFromWishlist(id);
    } else {
    
      addToWishlist({
        id,
        title,
        price,
        oldprice,
        image,
        qty: 1,
        stock,
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* الصورة */}
      <div className="relative h-[250px] w-[220px] overflow-visible group">
        <Link href={`/${slugify(title)}/${stableId}`}>
          <div className="relative h-[250px] w-[220px] overflow-hidden group  transition">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-2 transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
        </Link>

        {/* أيقونات المشاهدة والقلب */}
        <div className="hidden absolute bottom-3 left-1/2 -translate-x-1/2 lg:flex gap-2">
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={handleWishlistToggle}
                className={`fast-pulse w-9 cursor-pointer h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-black  transition  ${inWishlist
                  ? "text-red-500 hover:text-gray-300"
                  : " hover:text-gray-300  text-blac"
                  }`}
              >
                <Heart className="h-4 w-4"/>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("addToWishlist")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DialogDemo
                id={id}
                image={image}
                title={title}
                price={price}
                oldprice={oldprice}
                modelnumber={modelnumber}
                stock={stock}
                addItem={addItem}

              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("quickView")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* الاسم */}

      <h2 className="font-bold text-sm text-center mt-4 w-full line-clamp-1 min-h-[20px]">
        {title}
      </h2>
      {/* السعر */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <div className="flex items-center text-red-600">
          <h2 className="font-semibold text-xl">{price}</h2>
          <SaudiRiyal className="w-5 h-5" />
        </div>
        {oldprice > 0 && (
          <div className="flex items-center line-through text-gray-400">
            <h2 className="text-base">{oldprice}</h2>
            <SaudiRiyal className="w-4 h-4" />
          </div>
        )}
      </div>
      {/* زر الاشتراك */}
      <Button
        className="w-full max-w-[220px] mt-4 font-bold text-sm rounded-none cursor-pointer bg-gray-300 hover:bg-gray-300 text-green-900"
        disabled={stock === 0}
        onClick={() => {
          if (stock > 0) {
            addItem({ id, title, price, oldprice, qty: 1, image, stock });
            localStorage.setItem("selectedCat", "cart");
          }
          toast.success("addtocart");
        }}
      >
        {stock > 0 ? t("subscribe") : t("outOfStock")}
      </Button>
    </div>
  );
}







interface DialogDemoProps {
  id: string;
  image: string;
  title: string;
  price: number;
  oldprice: number;
  modelnumber: string | number | null;
  stock: number;
  addItem: (item: CartItem) => void; 

}





export function DialogDemo({ id, image, title, price, oldprice, modelnumber, stock, addItem }: DialogDemoProps) {
  const [dialogQty, setDialogQty] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleInc = () => setDialogQty(dialogQty + 1);
  const handleDec = () => setDialogQty(Math.max(1, dialogQty - 1));

  const toast = useToast();

  const handleAddToCart = () => {
    addItem({ id, title, price, oldprice, image, qty: dialogQty, stock });
    localStorage.setItem("selectedCat", "cart");
    toast.success("addtocart");
  };

  const t = useTranslations("card");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        
        if (!open) {
          setDialogQty(1);
        }
      }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              className="fast-pulse w-9 cursor-pointer h-9 flex items-center justify-center rounded-full bg-white/90 text-black hover:bg-black hover:text-white transition"
            >
              <Eye className="w-4 h-4" />
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("quickView")}</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[900px] h-[500px] rounded-none pr-0">

        <div className="flex    items-center">
          <div className="relative w-1/2 h-full ">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain px-0"
            />
          </div>
          <div className="flex flex-col w-1/2  gap-6">
            <div className=" w-full border-b-2 pb-4">
              <h1 className="font-bold text-2xl" >{title}</h1>
              <div className="items-center flex gap-2 pt-3">
                <div className="flex items-center text-red-400">
                  <h2 className=" font-semibold text-lg">{dialogQty * price} </h2>
                  <SaudiRiyal className="w-5 h-5" />
                </div>
                {oldprice > 0 && (
                  <div className="flex items-center line-through text-gray-400">
                    <h2 className="text-base">{dialogQty * oldprice}</h2>
                    <SaudiRiyal className="w-4 h-4" />
                  </div>
                )}

              </div>
            </div>
            <div className={`flex gap-2 items-center ${stock > 0 ? "text-green-700" : "text-red-600"}`}>
              {stock > 0 ? (
                <>
                  <CircleCheck className="w-4 h-4" />
                  <h3 className="font-normal text-base">{t("inStock")}</h3>
                </>
              ) : (
                <>
                  <CircleX className="w-4 h-4" />
                  <h3 className="font-normal text-base">{t("outOfStock")}</h3>
                </>
              )}
            </div>
            <div className="flex gap-1">
              <Star className="text-amber-300 w-5 fill-amber-300" />
              <Star className="text-amber-300 w-5 fill-amber-300 " />
              <Star className="text-amber-300 w-5 fill-amber-300" />
              <Star className="text-amber-300 w-5 fill-amber-300" />
              <Star className="text-amber-300 w-5 fill-amber-300" />
            </div>
            <div className="border flex justify-between rounded-sm p-2 cursor-auto">
              <div className="flex gap-4   items-center">
                <Barcode className="w-4 h-4 " />
                <h3 className="font-normal text-base text-black">{t("modelNumber")}</h3>
              </div>
              <div>{modelnumber}</div>

            </div>

            {stock > 0 && (
              <div className="flex items-center rounded-sm border">
                <span
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={handleInc}
                >
                  <Plus />
                </span>
                <span className="border-x px-4 py-2 cursor-auto">{dialogQty}</span>
                <span
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={handleDec}
                >
                  <Minus />
                </span>
              </div>
            )}
            <div className="flex gap-3 items-center w-full">
              <Button
                className={`font-bold text-sm rounded-none cursor-pointer ${stock > 0
                  ? "flex-1 max-w-[220px] bg-gray-300 hover:bg-gray-300 hover:border-transparent transition-all duration-300 border border-black text-green-900"
                  : "w-full text-green-900"
                  }`}
                disabled={stock === 0}
                onClick={handleAddToCart}

              >
                {stock > 0 ? (
                  <>
                    <ShoppingBag className="w-5 h-5 ml-2" />
                    {t("subscribe")}
                  </>
                ) : (
                  t("outOfStock")
                )}
              </Button>

              {stock > 0 && (
                <div className="flex items-center rounded-sm border flex-shrink-0">
                  <span
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={handleInc}
                  >
                    <Plus />
                  </span>
                  <span className="border-x px-4 py-2 cursor-auto">{dialogQty}</span>
                  <span
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={handleDec}
                  >
                    <Minus />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

