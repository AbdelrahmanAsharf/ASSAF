/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, {  useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { useTranslations, useLocale } from 'next-intl'
import { Switch } from "@/components/ui/switch"
import { Megaphone } from 'lucide-react';
import { UserRoundX } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from '@/components/ui/spinner'
import { Bounce, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { deleteAccountAction } from '@/actions/delete-account' 


export function ProfileForm2() {
    const locale = useLocale()
    const t = useTranslations("profile")
    const [isPromotionEnabled, setIsPromotionEnabled] = useState(false) 

    return (
        <div className='cursor-pointer'>
            {/* 🔹 الجزء الأول - الرسائل الترويجية */}
            <div className={`flex gap-4 items-center pb-8 border-b-2 ${locale === "ar" ? "flex-row" : "flex-row"
                }`}>
                <Megaphone className={`w-10 h-10 shrink-0 ${locale === "ar" ? "order-3" : "order-1"}`} />

                <div className={`flex-1 ${locale === "ar" ? "order-2 text-right" : "order-2 text-left"}`}>
                    <h2 className="font-semibold text-base">{t("promotionTitle")}</h2>
                    <p className="text-sm text-muted-foreground">
                        {t("promotionDescription")}
                    </p>
                </div>

                <Switch
                    id="promotion-switch"
                    checked={isPromotionEnabled}
                    onCheckedChange={setIsPromotionEnabled}
                    className={`cursor-pointer shrink-0 ${locale === "ar" ? "order-1" : "order-3"}`}
                />
            </div>

            {/* 🔹 الجزء الثاني - تعطيل الحساب */}
            <div className={`flex gap-4 flex-col md:items-center pt-8 `}>
                <div className='flex'>
                    <UserRoundX className={`w-10 h-10 shrink-0 ${locale === "ar" ? "order-3" : "order-1"}`} />

                    <div className={`flex-1  ${locale === "ar" ? "order-2 text-right" : "order-2 text-left"}`}>
                        <h2 className="font-semibold text-base">{t("disableAccountTitle")}</h2>
                        <p className="text-sm text-muted-foreground">
                            {t("disableAccountDescription")}
                        </p>
                    </div>
                </div>


                <div className={`w-full ${locale === "ar" ? "order-1" : "order-3"} `}>
                    <DisableButton />
                </div>
            </div>
        </div>
    )
}



export function DisableButton() {
    const t = useTranslations("profile")
    const totp = useTranslations("toast");
    const router = useRouter();
    const locale = useLocale()
    const dir = locale === "ar" ? "rtl" : "ltr";
    const [isPending, startTransition] = useTransition();
    const handleDisableAccount = () => {
        startTransition(async () => {
            try {
                const result = await deleteAccountAction();
                if (result.success) {
                    toast.success(totp("accountDeletedSuccess"), {
                        position: dir === "rtl" ? "top-right" : "top-left",
                        autoClose: 3000,
                        theme: "colored",
                        transition: Bounce,
                    });
                    router.push("/"); 
                } else {
                    throw new Error(result.error);
                }
            } catch (err: any) {
                toast.error(err.message || totp("profileerror"), {
                    position: dir === "rtl" ? "top-right" : "top-left",
                    autoClose: 3000,
                    theme: "colored",
                    transition: Bounce,
                });
            }
        });
    };
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="cursor-pointer w-full text-red-400 border border-red-300 bg-white hover:bg-red-400 hover:text-white py-6 px-4 rounded-sm"
                    >
                        {t("disableButton")}
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-127.5 flex flex-col items-center">
                    <div className='border rounded-full h-20 w-20 relative'>
                        <UserRoundX className="text-gray-400 w-7 h-7 m-6 absolute " />

                    </div>
                    <DialogHeader   >
                        <DialogTitle className='px-35 py-2 ' > {t("disableAccountTitle")}</DialogTitle>
                        <DialogDescription className='px-10'>
                            {t("disableDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <p className='text-red-400 text-xs font-normal'>{t("disableNote")}</p>
                    <DialogFooter className='gap-5'>
                        <DialogClose asChild>
                            <Button className='cursor-pointer bg-black text-white rounded-sm! py-6 px-16' >
                                {t("stayButton")}
                            </Button>
                        </DialogClose>

                        <Button
                            variant="outline"
                            className="cursor-pointer py-6 rounded-sm! border-black px-16 hover:bg-black hover:text-white"
                            onClick={handleDisableAccount}
                            disabled={isPending}
                        >
                            {isPending ? <Spinner /> : t("disableAccountTitle")}
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
