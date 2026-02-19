"use client";

import Link from "next/link";
import Image from "next/image";
import { XCircle, RefreshCw } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { WHATSAPP_SUPPORT_LINK } from "@/lib/constants/contacts";
import type { TransactionWithData } from "@/lib/prisma-adapters/types";
import { formatNumber } from "@/lib/utils";

type FailedPaymentProps = {
  transaction: TransactionWithData;
};

export default function FailedPayment({ transaction }: FailedPaymentProps) {
  const declineReason = transaction.fulfillmentNote;

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-black-1 border border-gray-200 dark:border-gray-800 shadow-xl p-8">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-500" />

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full scale-150" />
            <div className="relative bg-gradient-to-br from-red-400 to-rose-500 p-4 rounded-full animate-in zoom-in duration-300">
              <XCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Failed
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              We couldn't process your deposit of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                ₦{formatNumber(transaction.amount)}
              </span>
            </p>
          </div>

          {declineReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 w-full">
              <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
                Reason
              </p>
              <p className="text-sm text-red-800 dark:text-red-300">
                {declineReason}
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-black-2 rounded-xl p-4 w-full">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If funds were deducted from your account, please contact support
              with your transaction reference for assistance.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full pt-2">
            <Link
              href={ROUTES.DERIV.DEPOSIT}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>

            <a
              href={WHATSAPP_SUPPORT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              <Image
                src="/assets/whatsapp.png"
                alt="WhatsApp"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
              Contact Support
            </a>

            <Link
              href={ROUTES.DASHBOARD}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 dark:bg-black-2 hover:bg-gray-200 dark:hover:bg-black-3 text-gray-900 dark:text-white font-medium rounded-xl transition-colors border border-gray-200 dark:border-gray-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
