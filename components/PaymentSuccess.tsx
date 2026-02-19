"use client";

import Link from "next/link";
import { CheckCircle2, ExternalLink, LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { TransactionWithData } from "@/lib/prisma-adapters/types";
import { formatNumber } from "@/lib/utils";

type PaymentSuccessProps = {
  transaction: TransactionWithData;
};

export default function PaymentSuccess({ transaction }: PaymentSuccessProps) {
  const depositExtra = transaction.derivDepositExtra;

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-black-1 border border-gray-200 dark:border-gray-800 shadow-xl p-8">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500" />

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full scale-150 animate-ping" />
            <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-full animate-in zoom-in duration-300">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Successful!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              Your deposit has been processed and credited to your Deriv
              account.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-black-2 rounded-xl p-5 w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Amount Deposited</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₦{formatNumber(transaction.amount)}
              </span>
            </div>
            {depositExtra && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Credited to</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {depositExtra.derivLoginId} ({depositExtra.currency})
                  </span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Amount Received</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatNumber(depositExtra.amount)}{" "}
                    {depositExtra.currency}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full pt-2">
            <Link
              href={`/transactions/${transaction.transactionId}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              View Transaction Details
            </Link>

            <Link
              href={ROUTES.DASHBOARD}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 dark:bg-black-2 hover:bg-gray-200 dark:hover:bg-black-3 text-gray-900 dark:text-white font-medium rounded-xl transition-colors border border-gray-200 dark:border-gray-700"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
