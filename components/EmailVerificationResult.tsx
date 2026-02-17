"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendEmailVerification } from "@/lib/actions/auth.action";
import { ROUTES } from "@/lib/constants/routes";

const AUTO_REDIRECT_SECONDS = 5;

export function VerificationSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }

    router.push(ROUTES.ONBOARD_BIO);
  }, [countdown, router]);

  return (
    <div className="w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>

      <header className="space-y-3">
        <h1 className="text-36-bold text-primary dark:text-white tracking-tight">
          Email <span className="text-secondary">Verified!</span>
        </h1>
        <p className="text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium max-w-sm mx-auto">
          Your email has been successfully verified. You will be redirected
          shortly.
        </p>
      </header>

      <p className="text-14-regular text-black-1/50 dark:text-white/50">
        Redirecting in {countdown}s...
      </p>

      <Link href={ROUTES.ONBOARD_BIO}>
        <Button className="btn-primary w-full max-w-xs mx-auto">
          Continue to Onboarding
        </Button>
      </Link>
    </div>
  );
}

export function VerificationError({ error }: { error: string }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errorMessage =
    error === "INVALID_TOKEN"
      ? "The verification link is invalid. It may have already been used."
      : error === "TOKEN_EXPIRED"
        ? "The verification link has expired. Please request a new one."
        : "Something went wrong verifying your email. Please try again.";

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await sendEmailVerification({ email: email.trim() });

      if (result.success) {
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error(result.error?.message ?? "Failed to send email");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>

      <header className="space-y-3">
        <h1 className="text-36-bold text-primary dark:text-white tracking-tight">
          Verification <span className="text-red-500">Failed</span>
        </h1>
        <p className="text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium max-w-sm mx-auto">
          {errorMessage}
        </p>
      </header>

      <form onSubmit={handleResend} className="space-y-4 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="w-full h-12 rounded-lg border border-black-1/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 text-16-medium placeholder:text-black-1/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
        />
        <Button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="btn-primary w-full h-12 text-16-bold"
        >
          {isLoading ? "Sending..." : "Resend Verification Email"}
        </Button>
      </form>

      <p className="text-14-regular text-black-1/70 dark:text-white/70">
        Remember your credentials?{" "}
        <Link
          href={ROUTES.SIGN_IN}
          className="text-secondary font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
