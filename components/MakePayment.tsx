"use client";

import { useCallback, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { uploadPaymentReciept } from "@/lib/actions/payment.action";
import { cn } from "@/lib/utils";
import CopyToClipboard from "./CopyToClipboard";
import CustomButton from "./CustomButton";
import Dropzone from "./Dropzone";
import InfoCard from "./InfoCard";
import PaymentCountdown from "./PaymentCountDown";

type MakePaymentProps = {
  transaction: Transaction;
  handleRecieptUploadSuccess: (success: boolean) => void;
};

const MakePayment = ({
  transaction,
  handleRecieptUploadSuccess,
}: MakePaymentProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    setFile(file);
  }, []);

  const handlePaymentSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("paymentId", transaction.transactionId);

    setIsLoading(true);

    try {
      const uploadResult = await uploadPaymentReciept(formData);
      if (uploadResult.success) handleRecieptUploadSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return transaction.type === "deriv_deposit" ? (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-1.5">
        <h1 className="text-24-bold text-gray-900 dark:text-white">
          Deposit via Bank Transfer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
          Please make the exact transfer to the account details below.
        </p>
      </header>

      <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-black-1 border border-gray-200 dark:border-gray-800 shadow-xl transition-all">
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />

        <div className="p-6 md:p-8 space-y-6">
          {/* Amount Section */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Total Amount
            </span>
            <div className="flex items-center gap-2">
              <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                <span className="text-lg text-gray-400 font-medium mr-1.5 align-middle">
                  NGN
                </span>
                {transaction.amount.toLocaleString()}
              </span>
            </div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-secondary">
              Includes deposit charges
            </div>
          </div>

          <div className="h-px w-full bg-gray-100 dark:bg-gray-800" />

          {/* Account Details */}
          <div className="space-y-3">
            {/* Bank Name */}
            <div className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                {/* <div className="bg-white dark:bg-black-3 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                  <DerivCurrencyIcon currency="tUSDT" />
                </div> */}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    Bank Name
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {transaction.assignedBank.bankName}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Number */}
            <div className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                {/* <div className="bg-white dark:bg-black-3 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 text-blue-600">
                  <Hash size={20} />
                </div> */}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    Account Number
                  </span>
                  <span className="font-mono font-semibold text-lg text-gray-900 dark:text-white tracking-wide">
                    {transaction.assignedBank.accountNumber}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-black-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-colors">
                <CopyToClipboard
                  text={transaction.assignedBank.accountNumber}
                  className="w-5 h-5 text-gray-500 hover:text-blue-600 p-2 box-content"
                />
              </div>
            </div>

            {/* Account Name */}
            <div className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                {/* <div className="bg-white dark:bg-black-3 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 text-blue-600">
                  <User size={20} />
                </div> */}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    Account Name
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-base">
                    {transaction.assignedBank.accountName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary Warning Note */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-500">
                Do not save as beneficiary
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                This account is for this transaction only. Please do not save it
                for future use as details may change.
              </p>
            </div>
          </div>

          {/* Timer Section */}
          <div className="bg-gray-50 dark:bg-black-2/50 rounded-xl p-5 text-center space-y-4 border border-gray-100 dark:border-gray-800">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Awaiting payment...
              </p>
              <div className="flex justify-center">
                <PaymentCountdown
                  limitMinutes={15}
                  transactionDate={transaction.createdAt}
                />
              </div>
            </div>
            <InfoCard
              message="Make sure to confirm the payment before the timer runs out!"
              className="text-center text-xs bg-transparent p-0 text-gray-600 dark:text-gray-400"
            />
          </div>

          {/* Upload Section */}
          <div className="pt-2">
            <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Upload Payment Receipt
            </p>
            <Dropzone handleFileChange={handleFileChange} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-black-2 border-t border-gray-100 dark:border-gray-800">
          <CustomButton
            className={cn(
              "w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all btn-secondary",
              !file && "opacity-70",
            )}
            disabled={!file}
            onClick={handlePaymentSubmit}
            isLoading={isLoading}
          >
            Submit Payment
          </CustomButton>
        </div>
      </section>
    </div>
  ) : null;
};

export default MakePayment;
