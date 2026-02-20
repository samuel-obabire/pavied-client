"use client";

import { Loader, ShieldCheck } from "lucide-react";
import type { TransactionWithData } from "@/lib/prisma-adapters/types";

type ProcessingPaymentProps = {
  transaction: TransactionWithData;
  uploadedAt?: Date;
};

export default function ProcessingPayment({
  transaction,
}: ProcessingPaymentProps) {
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

          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-4 w-full">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-500 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">
                Safe to leave
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-500 mt-0.5">
                You can safely close this page. Your payment will be processed in the background.
              </p>
            </div>
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
