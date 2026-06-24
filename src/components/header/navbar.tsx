"use client";

import { Link } from "@/i18n/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChevronLeft } from "lucide-react";
import { slugify } from "@/lib/slugify";
import { useLocale } from "next-intl";
import { NavItem } from "@/types/nav";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export default function Navbar({
  dir,
  scrollTextColor,
  navs,
}: {
  dir: "rtl" | "ltr";
  scrollTextColor: string;
  navs: NavItem[];
}) {
  const locale = useLocale();

  return (
    <NavigationMenu
      viewport={false}
      className={`font-medium ${scrollTextColor} mx-auto relative z-50 hidden lg:block`}
    >
      <NavigationMenuList className="flex px-4 justify-center" dir={dir}>
        {navs.map((navItem) => {
          const title = locale === "ar" ? navItem.titleAr : navItem.titleEn;
          const subs = locale === "ar" ? navItem.subAr : navItem.subEn;
          const hasSubs = (subs?.length ?? 0) > 0;

          return (
            <NavigationMenuItem key={navItem.stableId}>
              {hasSubs ? (
                /* ✅ Level 1 عنده subs — Trigger بسهمه الطبيعي */
                <>
                  <NavigationMenuTrigger className={scrollTextColor}>
                    <Link href={`/${slugify(title)}/${navItem.stableId}`}>
                      {title}
                    </Link>
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="bg-white text-neutral-900 border shadow-xl rounded-md w-72 p-0">
                    <ul className="space-y-1">
                      {subs.map((sub) => {
                        const hasSubSub = (sub.subSub?.length ?? 0) > 0;

                        return (
                          <li key={sub.stableId}>
                            {hasSubSub ? (
                              <HoverCard openDelay={80} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                  <Link
                                    href={`/${slugify(sub.title)}/${sub.stableId}`}
                                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 rounded-md text-start"
                                  >
                                    <span>{sub.title}</span>
                                    {/* ✅ سهم Level 2 — بس لو فيه subSub */}
                                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                                  </Link>
                                </HoverCardTrigger>

                                <HoverCardContent
                                  side="left"
                                  align="start"
                                  sideOffset={8}
                                  className="w-64 bg-white border shadow-lg rounded-md p-2"
                                >
                                  <ul className="space-y-1">
                                    {sub.subSub!.map((subSub) => (
                                      <li key={subSub.stableId}>
                                        <Link
                                          href={`/${slugify(subSub.title)}/${subSub.stableId}`}
                                          className="block px-4 py-2  text-sm text-neutral-900 hover:bg-gray-100 rounded"
                                        >
                                          {subSub.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </HoverCardContent>
                              </HoverCard>
                            ) : (
                              /* Level 2 بدون subSub — بدون سهم */
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/${slugify(sub.title)}/${sub.stableId}`}
                                  className="block px-4 py-2.5 w-40 hover:bg-gray-100 rounded-md"
                                >
                                  {sub.title}
                                </Link>
                              </NavigationMenuLink>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                /* ✅ Level 1 مفيهوش subs خالص — Link عادي بدون سهم */
                <NavigationMenuLink asChild>
                  <Link
                    href={`/${slugify(title)}/${navItem.stableId}`}
                    className={navigationMenuTriggerStyle()}
                  >
                    <span className={scrollTextColor}>{title}</span>
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}