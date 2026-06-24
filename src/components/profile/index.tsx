'use client';

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { BellRing, BriefcaseBusiness, CircleUser, LogOut, Settings, ShoppingCart, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getMyRole } from '@/actions/get-role';


export default function Profileindex() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const t = useTranslations("menu");

    // ✅ جيب الـ role من Clerk publicMetadata
 const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        getMyRole().then((role) => {
            setIsAdmin(role === "ADMIN");
        });
    }, []);
    return (
        <div className="lg:py-5">
            <div className="bg-gray-700 flex py-20 items-center justify-center relative">
                <Image
                    src="/b7mx5Vp0dkXgh7M718NYszs9hmwKILfSRIemk0Fl.png"
                    alt="example image"
                    width={200}
                    height={200}
                />
            </div>
            <div className='border-b border-gray-300'>
                <div className="container lg:px-60">
                    <div className='flex lg:flex-row flex-col lg:gap-15'>
                        <Image
                            src={user?.imageUrl || "/default-avatar.png"}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="rounded-full h-25 w-25 relative -top-10 right-6 lg:right-10"
                        />
                        <h2 className='font-bold text-2xl'>
                            {user?.fullName?.toUpperCase()}
                        </h2>
                    </div>

                    <div className="flex md:gap-6 gap-2 flex-wrap">
                        {/* باقي الـ links زي ما هي */}
                        <Link href="/notifications" className="flex gap-2 items-center pb-4 border-b-1 border-transparent hover:border-gray-300 transition-all duration-400">
                            <BellRing className="h-4 w-4" />
                            <h2>{t("notifications")}</h2>
                        </Link>

                        <Link href="/orders" className="flex gap-2 items-center pb-4 border-b-1 border-transparent hover:border-gray-300 transition-all duration-400">
                            <BriefcaseBusiness className="h-4 w-4" />
                            <h2>{t("orders")}</h2>
                        </Link>

                        <Link href="/wishlist" className="flex gap-2 items-center pb-4 border-b-1 border-transparent hover:border-gray-300 transition-all duration-400">
                            <Star className="h-4 w-4" />
                            <h2>{t("wishlist")}</h2>
                        </Link>

                        <Link href="/pending_orders" className="flex gap-2 items-center pb-4 border-b-1 border-transparent hover:border-gray-300 transition-all duration-400">
                            <ShoppingCart className="h-4 w-4" />
                            <h2>{t("pendingOrders")}</h2>
                        </Link>

                        <Link href="/profile" className="flex gap-2 items-center pb-4 border-b-1 border-transparent hover:border-gray-300 transition-all duration-400">
                            <CircleUser className="h-4 w-4" />
                            <h2>{t("myAccount")}</h2>
                        </Link>

                        {/* ✅ زرار الأدمن — بيظهر بس لو أدمن */}
                        {isAdmin && (
                            <Link
                                href={`/admin`}
                                className="flex gap-2 items-center pb-4 border-b-1 border-transparent hover:border-gray-300 transition-all duration-400 text-purple-600 font-semibold"
                            >
                                <Settings className="h-4 w-4" />
                                <h2>لوحة التحكم</h2>
                            </Link>
                        )}

                        <div onClick={() => signOut({ redirectUrl: "/" })} className="flex gap-2 items-center pb-4 border-b-1 border-transparent hover:border-gray-300 transition-all duration-400 cursor-pointer">
                            <LogOut className="h-4 w-4 text-red-500" />
                            <h2>{t("signOut")}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}