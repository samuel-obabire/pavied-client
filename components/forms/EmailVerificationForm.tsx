"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

const EmailVerificationForm = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = () => {
    if (canResend) {
      // TODO: Implement actual resend logic here
      console.log("Resending code...");
      setTimeLeft(60);
      setCanResend(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual verification logic here
      console.log("Verifying code:", otp);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-4 w-full">
         <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={isLoading}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="h-12 w-12 md:h-14 md:w-14 text-lg" />
              <InputOTPSlot index={1} className="h-12 w-12 md:h-14 md:w-14 text-lg" />
              <InputOTPSlot index={2} className="h-12 w-12 md:h-14 md:w-14 text-lg" />
              <InputOTPSlot index={3} className="h-12 w-12 md:h-14 md:w-14 text-lg" />
              <InputOTPSlot index={4} className="h-12 w-12 md:h-14 md:w-14 text-lg" />
              <InputOTPSlot index={5} className="h-12 w-12 md:h-14 md:w-14 text-lg" />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-14-medium text-black-1/60 dark:text-white/60 text-center">
            Didn't receive code?{" "}
            <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={cn(
                    "font-semibold transition-colors",
                    canResend
                    ? "text-secondary hover:underline cursor-pointer"
                    : "text-black-1/40 dark:text-white/40 cursor-not-allowed"
                )}
            >
                {canResend ? "Resend" : `Resend in ${formatTime(timeLeft)}`}
            </button>
          </p>
      </div>

      <Button
        type="submit"
        className="btn-primary w-full h-12 text-16-bold"
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </Button>
    </form>
  );
};

export default EmailVerificationForm;
