"use client";

import { Clock, Loader2 } from "lucide-react";

type PendingPaymentProps = {
  transaction: DerivDeposit;
};

export default function PendingPayment({ transaction }: PendingPaymentProps) {
  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-black-1 border border-gray-200 dark:border-gray-800 shadow-xl p-8">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full scale-150 animate-pulse" />
            <div className="relative bg-gradient-to-br from-yellow-400 to-amber-500 p-4 rounded-full">
              <Clock className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Awaiting Payment
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              We're waiting for your payment of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                ₦{transaction.amount.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-black-2 rounded-xl p-5 w-full">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload your payment receipt to continue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span>Order pending confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
