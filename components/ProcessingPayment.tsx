"use client";

import { useEffect, useRef, useState } from "react";
import { Loader, ShieldCheck } from "lucide-react";

type ProcessingPaymentProps = {
  transaction: DerivDeposit;
  uploadedAt?: Date;
};

export default function ProcessingPayment({
  transaction,
  uploadedAt,
}: ProcessingPaymentProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTime = uploadedAt ? new Date(uploadedAt).getTime() : Date.now();
    const endTime = startTime + 2 * 60 * 1000;

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemainingSeconds(remaining);

      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [uploadedAt]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-black-1 border border-gray-200 dark:border-gray-800 shadow-xl p-8 py-12">
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary animate-pulse" />

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="relative bg-secondary p-4 rounded-full">
              <Loader className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Processing Your Payment
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              We're verifying your payment of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                ₦{transaction.amount.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-black-2 rounded-xl p-5 w-full space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estimated time remaining
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-white dark:bg-black-1 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                <span className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                  {String(minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-400">:</span>
              <div className="bg-white dark:bg-black-1 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                <span className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                  {String(seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
            {remainingSeconds <= 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Taking longer than expected. Please wait...
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 w-full">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Please don't close or leave this page
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Securely processing via Deriv</span>
          </div>
        </div>
      </div>
    </div>
  );
}
