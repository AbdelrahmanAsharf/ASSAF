/* eslint-disable @typescript-eslint/no-explicit-any */
// components/auth/OtpStep.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useToast } from "@/utils/toast";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";

type OtpStepProps = {
  email: string;
  // ✅ mode جديد: signIn للمستخدم الموجود، signUp للجديد
  mode: "signIn" | "signUp";
  onBack: () => void;
  onSuccess: () => void;
};

const RESEND_DELAY = 30;
const OTP_EXPIRY = 120;

export default function OtpStep({ email, mode, onBack, onSuccess }: OtpStepProps) {
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { setActive } = useClerk();
  const tLogin = useTranslations("login");
  const locale = useLocale();
  const { success, error } = useToast();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(RESEND_DELAY);
  const [expiry, setExpiry] = useState(OTP_EXPIRY);
  const [canResend, setCanResend] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  const autoVerifyTriggered = useRef(false);
  const verifyTimeout = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    if (expiry <= 0) {
      setOtp("");
      setCanResend(true);
      error("otpExpired");
      return;
    }
    const id = setInterval(() => setExpiry((e) => e - 1), 1000);
    return () => clearInterval(id);
  }, [expiry, error]);

  // ✅ Resend: مختلف حسب mode
  const handleResend = useCallback(async () => {
    setIsResendLoading(true);
    try {
      if (mode === "signIn") {
        if (!signInLoaded || !signIn) return;
        const factor = signIn.supportedFirstFactors?.find(
          (f: any) => f.strategy === "email_code"
        ) as { emailAddressId: string };
        if (!factor?.emailAddressId) throw new Error("Email factor not found");
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: factor.emailAddressId,
        });
      } else {
        // signUp mode
        if (!signUpLoaded || !signUp) return;
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      }

      autoVerifyTriggered.current = false;
      setOtp("");
      setTimer(RESEND_DELAY);
      setExpiry(OTP_EXPIRY);
      setCanResend(false);
      success("otp");
    } catch (err: any) {
      error(err.message || "resendError");
    } finally {
      setIsResendLoading(false);
    }
  }, [mode, signIn, signInLoaded, signUp, signUpLoaded, success, error]);

  // ✅ Verify: مختلف حسب mode
  const verifyOtp = useCallback(async () => {
    if (otp.length !== 6 || isVerifyLoading) return;

    setIsVerifyLoading(true);
    try {
      if (mode === "signIn") {
        // مستخدم موجود
        if (!signInLoaded || !signIn) return;
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: otp,
        });
        if (result.status === "complete" && signIn.createdSessionId) {
          await setActive({ session: signIn.createdSessionId });
          success("otpsuccess");
          onSuccess();
        } else {
          throw new Error("Verification failed");
        }
      } else {
        // مستخدم جديد
        if (!signUpLoaded || !signUp) return;
        const result = await signUp.attemptEmailAddressVerification({ code: otp });
        if (result.status === "complete" && result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          success("otpsuccess");
          onSuccess(); // ✅ onSuccess بتعمل syncUserToPrisma من UserS
        } else {
          throw new Error("Verification failed");
        }
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === "verification_expired" || err.code === "code_expired") {
        error("otpExpired");
        setCanResend(true);
        setOtp("");
      } else {
        error(err.errors?.[0]?.message || err.message || "otperror");
      }
    } finally {
      setIsVerifyLoading(false);
    }
  }, [otp, mode, signIn, signInLoaded, signUp, signUpLoaded, setActive, onSuccess, success, error, isVerifyLoading]);

  useEffect(() => {
    if (otp.length === 6 && !isVerifyLoading && !autoVerifyTriggered.current) {
      autoVerifyTriggered.current = true;
      if (verifyTimeout.current) clearTimeout(verifyTimeout.current);
      verifyTimeout.current = setTimeout(() => { verifyOtp(); }, 100);
    }
    if (otp.length < 6) { autoVerifyTriggered.current = false; }
    return () => { if (verifyTimeout.current) clearTimeout(verifyTimeout.current); };
  }, [otp, isVerifyLoading, verifyOtp]);

  return (
    <div className="relative">
      <button
        onClick={onBack}
        className="absolute bottom-120 left-0 p-0 rounded-full hover:bg-gray-100"
        aria-label="Back"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center gap-6 pt-12">
        <p className="text-center text-gray-600 max-w-xs">
          {tLogin("otpDescription")}
        </p>
        <h2 className="font-medium">{email}</h2>

        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="w-12 h-12 text-lg rounded-lg border border-gray-400"
            />
          ))}
        </InputOTP>

        <div className="w-full flex flex-col gap-3">
          <Button
            onClick={verifyOtp}
            disabled={otp.length !== 6 || isVerifyLoading}
            className="w-full"
          >
            {isVerifyLoading ? <Spinner /> : tLogin("verifyButton")}
          </Button>

          <div className="text-center text-sm text-gray-500">
            {expiry > 0 && (
              <span>
                {tLogin("codeExpiresIn")}{" "}
                <strong>{formatTime(expiry)}</strong>
              </span>
            )}
          </div>

          {!canResend ? (
            <p className="text-center text-sm text-gray-400">
              {tLogin("resendAfter")} {timer}{" "}
              {locale === "ar" ? "ثانية" : "seconds"}
            </p>
          ) : (
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResendLoading}
              className="w-full"
            >
              {isResendLoading ? <Spinner /> : tLogin("resendButton")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}