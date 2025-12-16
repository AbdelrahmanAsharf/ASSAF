/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react"
import { useUser } from '@clerk/nextjs'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslations, useLocale } from 'next-intl'

import { createProfileSchema, type ProfileSchema } from "@/validations/auth";
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/utils/toast'
import { syncUserToPrisma } from '@/actions/sync-user' 


export function ProfileForm1() {
    const { user } = useUser()
    const t = useTranslations("profile") 
    const locale = useLocale()
    const tValidations = useTranslations("validations");
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();



    const form = useForm<ProfileSchema>({
        resolver: zodResolver(createProfileSchema(tValidations)),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.emailAddresses[0]?.emailAddress || "",
            phone:
                typeof user?.unsafeMetadata?.phone === "string"
                    ? user.unsafeMetadata.phone
                    : "",
            sex:
                user?.unsafeMetadata?.sex === "male" || user?.unsafeMetadata?.sex === "female"
                    ? user.unsafeMetadata.sex
                    : undefined,
            birthday:
                user?.unsafeMetadata?.birthday && typeof user.unsafeMetadata.birthday === "string"
                    ? new Date(user.unsafeMetadata.birthday)
                    : undefined,
        },
        mode: "onBlur", 
    });


    const onSubmit = async (values: ProfileSchema) => {
        if (!user) {
            toast.error("profileerror");
            return;
        }
        setIsLoading(true);
        try {
            await user.update({
                firstName: values.firstName,
                lastName: values.lastName,
                unsafeMetadata: {
                    phone: values.phone,
                    sex: values.sex,
                    birthday: values.birthday.toISOString(),
                },
            })
            await user.reload();
            await syncUserToPrisma();
            toast.success("profileupdate");
        } catch (err: any) {
            toast.error(err.message || ("profileerror"));
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-xl font-semibold">{t("title")}</h2>

                {/* الاسم الأول والأخير */}
                <div className="flex flex-col md:flex-row gap-4 ">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-[200px]">
                                <FormLabel>{t("firstName")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("firstName")} {...field} onBlur={() => form.trigger("firstName")} />
                                </FormControl>
                                <FormMessage className="min-h-[20px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-[200px]">
                                <FormLabel>{t("lastName")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("lastName")} {...field} onBlur={() => form.trigger("lastName")} />
                                </FormControl>
                                <FormMessage className="min-h-[20px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* النوع وتاريخ الميلاد */}
                <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-[200px]">
                                <FormLabel>{t("birthday")}</FormLabel>

                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className="justify-between font-normal w-full"
                                                id="date"
                                            >
                                                {field.value
                                                    ? new Date(field.value).toLocaleDateString(locale)
                                                    : t("selectDate")}
                                                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                field.onChange(date)
                                                setOpen(false) 
                                                form.trigger("birthday");
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <FormMessage className="min-h-[20px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-[200px]">
                                <FormLabel>{t("sex")}</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        form.trigger("sex"); 
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={t("selectGender")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="male">{t("male")}</SelectItem>
                                            <SelectItem value="female">{t("female")}</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="min-h-[20px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* البريد والهاتف */}
                <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-[200px]">
                                <FormLabel>{t("email")}</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder={t("email")} {...field} disabled />
                                </FormControl>
                                <FormMessage className="min-h-[20px]" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex-1 min-w-[200px]">
                                <FormLabel>{t("phone")}</FormLabel>
                                <FormControl>
                                    <div className={locale === "ar" ? "phone-input-rtl" : ""}>
                                        <PhoneInput
                                            country="eg"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={() => form.trigger("phone")}
                                            inputClass="!w-full !h-11"
                                            containerClass={locale === "ar" ? "rtl-phone-container" : ""}
                                            buttonClass={locale === "ar" ? "rtl-phone-button" : ""}
                                            dropdownClass={locale === "ar" ? "rtl-phone-dropdown" : ""}
                                            enableSearch
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="min-h-[20px]" />
                            </FormItem>
                        )}
                    />

                </div>

                <Button
                    type="submit"
                    className="w-full py-6 cursor-pointer rounded-sm"
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner /> : t("save")}
                </Button>
            </form>
        </Form>
    )
}

