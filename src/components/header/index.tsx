"use client";

import {
  MenuIcon,
  ChevronLeft,
  BellRing,
  Star,
  ShoppingCart,
  LogOut,
  CircleUser,
  BriefcaseBusiness,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Navbar from "./navbar";
import { slugify } from "@/lib/slugify";
import { useCart } from "@/store/cart-store";
import { Link } from "@/i18n/navigation";
import { UserS } from "./user";
import { useClerk, useUser } from "@clerk/nextjs";
import {  SubNavItem } from "@/types/nav";

export default function Header({
  dir,
  locale,
  navs,
}: {
  dir: "rtl" | "ltr";
  locale: string;
  navs: NavItem[]; 
}) {
  const pathname = usePathname();
  const isHome = pathname === "/ar" || pathname === "/en";
  const [selectedLang, setSelectedLang] = useState<"en" | "ar">(
    locale === "ar" ? "ar" : "en",
  );
  const [textColorClass, setTextColorClass] = useState("text-white");
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [bgClass, setBgClass] = useState("bg-transparent");
  const [header, setHeader] = useState("pt-15");
  const [shop, setShop] = useState("/icon/download (1).svg");
  const [img, setImg] = useState("/icon/VT6ZK4.png");
  const [shopcolor, setShopcolor] = useState(" bg-white text-black");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (isHome) {
        setHeader("pt-15");
        setShop("/icon/download (1).svg");
        if (scrollY > 300) {
          setShowFixedHeader(true);
          setBgClass("bg-white/30 backdrop-blur-sm");
          setTextColorClass("text-black/80");
          setImg("/icon/b7mx5Vp0dkXgh7M718NYszs9hmwKILfSRIemk0Fl (1).png");
          setHeader("pt-4 pb-4");
          setShop("/icon/download.svg");
        } else {
          setShowFixedHeader(false);
        }
      } else {
        setHeader("pt-0");
        setShop("/icon/download.svg");
        setShopcolor("bg-red-400 text-white");

        if (scrollY > 200) {
          setShowFixedHeader(true);
          setBgClass("bg-white shadow-sm");
          setTextColorClass("text-black");
          setImg("/icon/b7mx5Vp0dkXgh7M718NYszs9hmwKILfSRIemk0Fl (1).png");
          setHeader("pt-4 pb-4");
        } else {
          setShowFixedHeader(false);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

 
  const { items } = useCart();
  const { user, isSignedIn } = useUser();

  return (
    <>
      {/* Header العادي في البداية - ينزل مع الصفحة */}
      <div className="absolute w-full">
        <header
          className={cn(
            `transition-all duration-300  `,
            isHome ? " text-white" : "bg-white text-black",
            "cursor-pointer",
          )}
        >
          <div
            className={`relative z-10 flex items-center justify-between container ${header}  `}
          >
            <div className="cursor-pointer flex gap-3 ">
              <SheetDemo dir={dir} navs={navs} />
              <SearchDialog />
              <LanguageSwitcher
                dir={dir}
                setSelectedLang={setSelectedLang}
                selectedLang={selectedLang}
              />
            </div>
            <div>
              <Link
                href="/"
                className="flex items-center justify-center cursor-pointer"
              >
                <Image
                  src={
                    isHome
                      ? "/icon/VT6ZK4.png"
                      : "/icon/b7mx5Vp0dkXgh7M718NYszs9hmwKILfSRIemk0Fl (1).png"
                  }
                  alt="Logo"
                  width={160}
                  height={100}
                  priority
                />
              </Link>
            </div>
            <div className="flex gap-6">
              {isSignedIn ? (
                <DropdownMenuDemo user={user} isSignedIn={isSignedIn} />
              ) : (
                <UserS />
              )}
              <Link href="/cart" className="relative cursor-pointer">
                <Image src={shop} alt="" width={20} height={20} />
                <span
                  className={cn(
                    `${shopcolor} rounded-full justify-center flex h-5 w-5 text-sm font-semibold absolute -top-4 items-center`,
                    dir === "rtl" ? "-right-3" : "-left-3",
                  )}
                >
                  {items.length}
                </span>
              </Link>
            </div>
          </div>
        </header>
        <Navbar
          dir={dir}
          scrollTextColor={isHome ? "text-white" : "text-black"}
          navs={navs}
        />
      </div>

      {/* Header الثابت - يظهر بعد السكرول */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          showFixedHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0",
          bgClass,
          textColorClass,
          "cursor-pointer",
        )}
      >
        <div
          className={`relative z-10 flex items-center justify-between container  ${header}`}
        >
          <div className="cursor-pointer flex gap-3">
            <SheetDemo dir={dir} navs={navs} />
            <SearchDialog />
          </div>
          <div>
            <Link
              href="/"
              className="flex items-center justify-center cursor-pointer"
            >
              <Image src={img} alt="Logo" width={140} height={100} priority />
            </Link>
          </div>
          <div className="flex gap-6">
            {isSignedIn ? (
              <DropdownMenuDemo user={user} isSignedIn={isSignedIn} />
            ) : (
              <UserS />
            )}
            <Link href="/cart" className="relative cursor-pointer">
              <Image src={shop} alt="" width={20} height={20} />
              <span
                className={cn(
                  `${shopcolor} rounded-full justify-center flex h-5 w-5 text-sm font-semibold absolute -top-4 items-center`,
                  dir === "rtl" ? "-right-3" : "-left-3",
                )}
              >
                {items.length}
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export function SheetDemo({
  dir,
  navs,
}: {
  dir: "rtl" | "ltr";
  navs: NavItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<NavItem | null>(null);
  const locale = useLocale();
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="cursor-pointer block lg:hidden" type="button">
          <MenuIcon className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-80">
        <SheetHeader className="border-b-2">
          <SheetTitle
            className="cursor-pointer"
            onClick={() => {
              if (active) setActive(null);
            }}
          >
            {active
              ? locale === "ar"
                ? active.titleAr
                : active.titleEn
              : "profile"}
          </SheetTitle>
        </SheetHeader>
        <AccordionNav
          navs={navs}
          dir={dir}
          onNavigate={() => setIsOpen(false)}
          active={active}
          setActive={setActive}
        />
      </SheetContent>
    </Sheet>
  );
}




export function AccordionNav({
  navs,
  dir,
  onNavigate,
  active,
  setActive,
}: {
  navs: NavItem[];
  dir: "rtl" | "ltr";
  onNavigate?: () => void;
  active: NavItem | null;
  setActive: (item: NavItem | null) => void;
}) {
  const locale = useLocale();
  // ✅ state جديد للمستوى التالت
  const [activeSub, setActiveSub] = useState<SubNavItem | null>(null);

  // ✅ لما تقفل الـ Level1 لازم تقفل الـ Level2 معاه
  function handleSetActive(item: NavItem | null) {
    setActiveSub(null);
    setActive(item);
  }

  return (
    <div
      className="w-full font-medium text-sm bg-white min-h-screen p-2"
      dir={dir}
    >
      {activeSub ? (
        /* ✅ المستوى التالت — subSub */
        <div>
          {activeSub.subSub?.map((subSub) => {
            const subSubSlug = slugify(subSub.title);
            return (
              <div
                key={subSub.stableId}
                className="border-b py-2.5 md:py-5 cursor-pointer hover:bg-gray-50"
              >
                <Link
                  href={`/${subSubSlug}/${subSub.stableId}`}
                  className="block hover:underline"
                  onClick={() => onNavigate?.()}
                >
                  {subSub.title}
                </Link>
              </div>
            );
          })}
        </div>
      ) : active ? (
        /* المستوى الثاني — sub */
        <div>
          {(locale === "ar" ? active.subAr : active.subEn).map((sub) => {
            const subSlug = slugify(sub.title);
            const hasSubSub = (sub.subSub?.length ?? 0) > 0;

            return hasSubSub ? (
              /* ✅ فيه subSub — يفتح المستوى التالت */
              <div
                key={sub.stableId}
                className="flex justify-between items-center border-b py-2.5 md:py-5 cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveSub(sub)}
              >
                <span>{sub.title}</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            ) : (
              /* بدون subSub — Link عادي */
              <div
                key={sub.stableId}
                className="border-b py-2.5 md:py-5 cursor-pointer hover:bg-gray-50"
              >
                <Link
                  href={`/${subSlug}/${sub.stableId}`}
                  className="block hover:underline"
                  onClick={() => onNavigate?.()}
                >
                  {sub.title}
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        // المستوى الأول — Level 1
        <div>
          {navs.map((item, i) => {
            const title = locale === "ar" ? item.titleAr : item.titleEn;
            const slug = slugify(title);
            const subs = locale === "ar" ? item.subAr : item.subEn;

            return subs.length > 0 ? (
              <div
                key={i}
                className="flex justify-between items-center border-b py-2.5 md:py-5 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSetActive(item)}
              >
                <span>{title}</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            ) : (
              <div
                key={i}
                className="border-b py-2.5 md:py-5 cursor-pointer hover:bg-gray-50"
              >
                <Link
                  href={`/${slug}/${item.stableId}`}
                  onClick={() => onNavigate?.()}
                >
                  {title}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavItem } from "@/types/nav";
import { SearchDialog } from "./search";
import { LanguageSwitcher } from "./LanguageSwitche";

interface DropdownMenuDemoProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
  } | null;
  isSignedIn: boolean;
}

export function DropdownMenuDemo({ user, isSignedIn }: DropdownMenuDemoProps) {
  const { signOut } = useClerk();
  const locale = useLocale();
  const isRTL = locale === "ar"; // ✅ تحقق من اللغة الحالية
  const t = useTranslations("menu"); // 👈 استخدم namespace مثل menu.json

  if (!isSignedIn) return null; // المستخدم مش مسجل
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer" type="button">
          <Image
            src={user?.imageUrl || "/default-avatar.png"}
            alt="avatar"
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-60 mt-3 ${isRTL ? "ml-10" : "mr-10"}`} // ✅ استبدال mx-10
        align="center" // ✅ انعكاس الاتجاه حسب اللغة
      >
        {" "}
        <DropdownMenuGroup>
          <Link href="/notifications">
            <DropdownMenuItem>
              {t("notifications")}
              <DropdownMenuShortcut>
                {" "}
                <BellRing className="text-black" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/orders">
            <DropdownMenuItem>
              {t("orders")}
              <DropdownMenuShortcut>
                <BriefcaseBusiness className="text-black" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          <Link href="/pending_orders">
            <DropdownMenuItem>
              {t("pendingOrders")}
              <DropdownMenuShortcut>
                {" "}
                <ShoppingCart className="text-black" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/wishlist">
            <DropdownMenuItem>
              {t("wishlist")}
              <DropdownMenuShortcut>
                <Star className="text-black" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          <Link href="/profile">
            <DropdownMenuItem>
              {t("myAccount")}
              <DropdownMenuShortcut>
                {" "}
                <CircleUser className="text-black" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
            {t("signOut")}
            <DropdownMenuShortcut>
              {" "}
              <LogOut className="text-red-500 " />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
