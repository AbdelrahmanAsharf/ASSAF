"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { GlobeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const flags = {
  en: "https://flagcdn.com/w20/gb.png",
  ar: "https://flagcdn.com/w20/sa.png",
};

interface LanguageSwitcherProps {
  dir: "rtl" | "ltr";
  selectedLang: "en" | "ar";
  setSelectedLang: (lang: "en" | "ar") => void;
}

export function LanguageSwitcher({
  dir,
  selectedLang,
  setSelectedLang,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");

  const changeLanguage = () => {
    const parts = pathname.split("/");
    parts[1] = selectedLang;
    router.push(parts.join("/"));
  };

  const LanguageContent = (
    <>
      <RadioGroup
        value={selectedLang}
        onValueChange={(value) =>
          setSelectedLang(value as "en" | "ar")
        }
        style={{ direction: dir }}
      >
        <div className="flex items-center gap-3 py-3">
          <RadioGroupItem value="en" id="en" />
          <Label
            htmlFor="en"
            className="flex items-center justify-between w-full cursor-pointer"
          >
            English
            <Image src={flags.en} alt="English" width={20} height={20} />
          </Label>
        </div>

        <div className="flex items-center gap-3 py-3">
          <RadioGroupItem value="ar" id="ar" />
          <Label
            htmlFor="ar"
            className="flex items-center justify-between w-full cursor-pointer"
          >
            العربية
            <Image src={flags.ar} alt="Arabic" width={20} height={20} />
          </Label>
        </div>
      </RadioGroup>
    </>
  );

  return (
    <>
      {/* ===== Desktop (Dialog) ===== */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="hidden lg:block">
            <GlobeIcon className="w-5 h-5" />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader
            className={cn(dir === "rtl" ? "text-right" : "text-left")}
          >
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>

          {LanguageContent}

          <DialogFooter>
            <Button onClick={changeLanguage} className="w-full">
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Mobile (Drawer) ===== */}
      <Drawer>
        <DrawerTrigger asChild>
          <button className="block lg:hidden">
            <GlobeIcon className="w-5 h-5" />
          </button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("title")}</DrawerTitle>
          </DrawerHeader>

          <div className="px-4">{LanguageContent}</div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button  onClick={changeLanguage}>{t("confirm")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
