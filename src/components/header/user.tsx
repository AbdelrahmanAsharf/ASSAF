/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  createEmailSchema,
  createDetailsSchema,
  type EmailSchema,
  type DetailsSchema,
} from "@/validations/auth";
import { Spinner } from "../ui/spinner";
import { checkEmailExists } from "@/actions/check-email-exists";
import OtpStep from "../auth/OtpStep";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useToast } from "@/utils/toast";
import { syncUserToPrisma } from "@/actions/sync-user";

export interface UserSRef {
  openDialog: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserSProps {}

export const UserS = forwardRef<UserSRef, UserSProps>((props, ref) => {
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const { setActive } = useClerk();

  const [step, setStep] = useState<"email" | "otp" | "details">("email");
  const [email, setEmail] = useState("");
  // ✅ نوع الـ OTP: signIn للمستخدم الموجود، signUp للجديد
  const [otpMode, setOtpMode] = useState<"signIn" | "signUp">("signIn");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const locale = useLocale();
  const t = useTranslations("validations");
  const tLogin = useTranslations("login");
  const dir = locale === "ar" ? "rtl" : "ltr";
  const defaultCountry = locale === "ar" ? "eg" : "us";
  const toast = useToast();

  const triggerRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    openDialog: () => {
      triggerRef.current?.click();
    },
  }));

  const emailForm = useForm<EmailSchema>({
    resolver: zodResolver(createEmailSchema(t)),
    defaultValues: { email: "" },
  });

  const detailsForm = useForm<DetailsSchema>({
    resolver: zodResolver(createDetailsSchema(t)),
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });

  async function handleEmail(values: EmailSchema) {
    if (!signInLoaded || !signUpLoaded || !signIn || !signUp) {
      toast.error("clerkNotReady");
      return;
    }

    setIsEmailLoading(true);

    try {
      const { exists } = await checkEmailExists(values.email);

      if (exists) {
        // ✅ مستخدم موجود: signIn مباشرة وبعت OTP
        await signIn.create({ identifier: values.email });

        const factor = signIn.supportedFirstFactors?.find(
          (f: any) => f.strategy === "email_code",
        ) as { emailAddressId: string };

        if (!factor?.emailAddressId) throw new Error("Email factor not found");

        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: factor.emailAddressId,
        });

        setEmail(values.email);
        setOtpMode("signIn");
        setStep("otp");
        toast.success("otp");
      } else {
        // ✅ مستخدم جديد: روح على Details الأول، مش create هنا
        setEmail(values.email);
        setStep("details");
      }
    } catch (err: any) {
      toast.error("signupError");
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function handleSaveDetails(values: DetailsSchema) {
    if (!signUpLoaded || !signUp) return;

    setIsDetailsLoading(true);

    try {
      // ✅ create مرة واحدة بس بكل البيانات
      await signUp.create({
        emailAddress: email,

        unsafeMetadata: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
        },
      });

      // ✅ بعد create، بعت OTP للإيميل
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setOtpMode("signUp");
      setStep("otp");
      toast.success("otp");
    } catch (err: any) {
      console.error(err);
      toast.error("detailsError");
    } finally {
      setIsDetailsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button ref={triggerRef}>
          <User className="cursor-pointer" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-95 rounded-sm" dir={dir}>
        <DialogHeader className="items-center gap-6 mb-5">
          <DialogDescription className="rounded-full border-gray-200 border p-6">
            <User />
          </DialogDescription>
          <DialogTitle className="text-gray-700 font-bold!">
            {tLogin("title")}
          </DialogTitle>
        </DialogHeader>

        {step === "email" && (
          <>
            <div id="clerk-captcha"></div>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleEmail)}
                className="space-y-8"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pb-3 text-gray-500">
                        {tLogin("emailLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="your@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage>
                        {emailForm.formState.errors.email?.message
                          ? t("invalidEmail")
                          : null}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full rounded-sm py-5 text-gray-300 font-bold cursor-pointer"
                  disabled={isEmailLoading}
                >
                  {isEmailLoading ? <Spinner /> : tLogin("button")}
                </Button>
              </form>
            </Form>
          </>
        )}

        {step === "otp" && (
          <OtpStep
            email={email}
            // ✅ بعت mode عشان OtpStep يعرف يتعامل مع signIn أو signUp
            mode={otpMode}
            onBack={() => setStep(otpMode === "signIn" ? "email" : "details")}
            onSuccess={async () => {
              // ✅ لو signUp، بعمل sync بعد نجاح الـ OTP
              if (otpMode === "signUp") {
                await syncUserToPrisma();
              }
              triggerRef.current?.click();
            }}
          />
        )}

        {step === "details" && (
          <>
            <div id="clerk-captcha"></div>
            <Form {...detailsForm}>
              <form
                onSubmit={detailsForm.handleSubmit(handleSaveDetails)}
                className="space-y-4"
              >
                <FormField
                  control={detailsForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLogin("firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tLogin("firstNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLogin("lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tLogin("lastNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-50">
                      <FormLabel>{tLogin("phone")}</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder={t("phone")} {...field} />
                      </FormControl>
                      <FormMessage className="min-h-5" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isDetailsLoading}
                >
                  {isDetailsLoading ? <Spinner /> : tLogin("submitButton")}
                </Button>
              </form>
            </Form>{" "}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});

UserS.displayName = "UserS";
