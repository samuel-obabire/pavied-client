"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendEmailVerification } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";

const COOLDOWN_SECONDS = 60;

const EmailVerificationForm = ({ email }: { email: string }) => {
  const [timeLeft, setTimeLeft] = useState(COOLDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }

    setCanResend(true);
  }, [timeLeft]);

  const handleResend = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);
    try {
      const result = await sendEmailVerification({ email });

      if (result.success) {
        toast.success("Verification email sent!");
        setTimeLeft(COOLDOWN_SECONDS);
        setCanResend(false);
      } else {
        toast.error(result.error?.message ?? "Failed to send email");
      }
    } catch {
      toast.error("An unexpected error occurred");
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
    <div className="w-full flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-4 w-full">
        

        <Button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className={cn(
            "font-semibold w-full h-12 text-16-bold transition-all",
            canResend
              ? "btn-primary"
              : "btn-secondary opacity-50 cursor-not-allowed",
          )}
        >
          {isLoading
            ? "Sending..."
            : canResend
              ? "Resend Link"
              : `Resend available in ${formatTime(timeLeft)}`}
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
