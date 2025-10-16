"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";

import { uploadPaymentReciept } from "@/lib/actions/payment.action";
import { cn } from "@/lib/utils";

import CopyToClipboard from "./CopyToClipboard";
import CustomButton from "./CustomButton";
import DerivCurrencyIcon from "./DerivCurrencyIcon";
import Dropzone from "./Dropzone";
import InfoCard from "./InfoCard";
import PaymentCountdown from "./PaymentCountDown";

type MakePaymentProps = {
  paymentId: string;
  transaction: Transaction;
};

const MakePayment = ({ paymentId, transaction }: MakePaymentProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    setFile(file);
  }, []);

  const handlePaymentSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("paymentId", paymentId);

    setIsLoading(true);

    try {
      const result = await uploadPaymentReciept(formData);
      console.log(result);
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
    <div className="w-full max-w-xl gap-4 space-y-6">
      <div className="space-y-3">
        <header>
          <h1 className="text-14-medium md:text-16-medium mb-2">
            Deposit via bank account
          </h1>

          <p className="text-14-medium">
            Please make sure to fill the correct input to avoid transaction
            difficulties.
          </p>
        </header>

        <section className="bg-white_dark-black-1 card-border rounded-xl px-4 py-6">
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <div>Bank Name</div>
              <div className="bg-accent dark:bg-black-2 rounded-xl p-2">
                <div className="bg-white_dark-black-1 flex w-max gap-1 rounded-lg  p-2">
                  <DerivCurrencyIcon currency="tUSDT" />
                  <span>{transaction.assignedBank.bankName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>Account number</div>
              <div className="bg-accent dark:bg-black-2  flex items-center justify-between rounded-xl p-2 pr-6">
                <div className="bg-white_dark-black-1 flex w-max gap-1 rounded-lg p-2">
                  <span>{transaction.assignedBank.accountNumber}</span>
                </div>

                <CopyToClipboard text={paymentId} />
              </div>
            </div>

            <div className="space-y-2">
              <div>Amount</div>
              <div className="bg-accent dark:bg-black-2  rounded-xl p-2">
                <div className="bg-white_dark-black-1 flex w-max gap-1 rounded-lg p-2">
                  <Image
                    src="/assets/naira.svg"
                    alt="naira"
                    height={20}
                    width={20}
                    className="mr-1 block"
                  />
                  NGN &nbsp; |<span>{transaction.amount}</span>
                </div>
              </div>
            </div>

            <p className="text-14-medium dark:text-gray-400">
              Includes deposit charges
            </p>

            <section className="mx-auto flex w-[80%] flex-col items-center justify-center gap-2">
              <p>Awaiting payment from you...</p>

              <PaymentCountdown
                limitMinutes={10}
                transactionDate={transaction.createdAt}
              />

              <InfoCard
                message="Make sure to confirm the payment before the timer runs out!"
                className="text-center"
              />

              <div>
                <Dropzone handleFileChange={handleFileChange} />
              </div>
            </section>
          </div>
        </section>

        <CustomButton
          className={cn("btn-secondary w-full")}
          disabled={!file}
          onClick={handlePaymentSubmit}
          isLoading={isLoading}
        >
          Submit Payment
        </CustomButton>
      </div>
    </div>
  ) : null;
};

export default MakePayment;
