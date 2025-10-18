"use client";

import { ChangeEvent, useState } from "react";

import { createDerivWithdrawalTransaction } from "@/lib/actions/deriv.action";

import BankAccountCard from "./BankAccountCard";
import CustomButton from "./CustomButton";
import DataRenderer from "./DataRenderer";
import DerivAccountCard from "./DerivAccountCard";
import DerivWithdrawalVerification from "./DerivWithdrawalVerification";
import { exchangeRates } from "./ExchangeRateList";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const DerivWithdrawalFlow = ({
  derivAccountsRes,
  bankAccountsRes,
}: {
  derivAccountsRes: ActionResponse<DerivAccount[]>;
  bankAccountsRes: ActionResponse<BankAccount[]>;
}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedDerivAccount, setSelectedDerivAccount] =
    useState<null | DerivAccount>(null);
  const [selectedBankAccount, setSelectedBankAccount] =
    useState<null | BankAccount>(null);

  const [withdrawalAmount, setDepositAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [transactionId, setTransactionId] = useState("");

  const onSubmit = async () => {
    if (!selectedBankAccount || !selectedDerivAccount) return;

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await createDerivWithdrawalTransaction({
        amount: Number(withdrawalAmount),
        currency: selectedDerivAccount.currency,
        derivLoginId: selectedDerivAccount.accountId,
        receivingBankAccountNumber: selectedBankAccount.accountNumber,
        receivingBankName: selectedBankAccount.bankName,
        recievingBankAccountName: selectedBankAccount.accountName,
        receivingBankCode: selectedBankAccount.bankCode,
      });

      if (response.success) {
        if (response.data?.transactionId) {
          setTransactionId(response.data.transactionId);
        } else {
          setErrorMessage("Transaction ID is missing.");
        }
      } else if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "An error occured"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDerivAccountSelection = (selectedDerivAccount: DerivAccount) => {
    setSelectedDerivAccount((prevSelectedAccount) => {
      if (prevSelectedAccount?.accountId !== selectedDerivAccount.accountId) {
        return selectedDerivAccount;
      }

      return null;
    });
  };

  const handleBankAccountSelection = (selectedBankAccount: BankAccount) => {
    setSelectedBankAccount((prevSelectedAccount) => {
      if (
        prevSelectedAccount?.accountNumber !==
          selectedBankAccount?.accountNumber ||
        prevSelectedAccount?.bankCode !== selectedBankAccount?.bankCode
      ) {
        return selectedBankAccount;
      }

      return null;
    });
  };

  const handleNextClick = async () => {
    if (
      (step === 1 && !selectedDerivAccount) ||
      (step === 2 && !selectedBankAccount)
    ) {
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleWithdrawalAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setDepositAmount(value);

    const s = exchangeRates.find(
      (ex) => ex.currency === selectedDerivAccount?.currency
    )!;

    const convertedAmount = Number(value) * s.withdrawal;

    setConvertedAmount(convertedAmount);
  };

  if (transactionId && step === 3) {
    return <DerivWithdrawalVerification transactionId={transactionId} />;
  }

  return (
    <div className="sm:max-w-md">
      {step === 1 ? (
        <div className="mt-4 space-y-3">
          <p className="text-12-medium opacity-75">
            Please select the deriv account you want to withdrawal from
          </p>

          <DataRenderer
            data={derivAccountsRes.data}
            success={derivAccountsRes.success}
            error={derivAccountsRes.error}
            render={(derivAccounts) => {
              return derivAccounts.map((account) => (
                <div
                  className="relative cursor-default active:top-0.5"
                  key={account.accountId}
                  onClick={() => handleDerivAccountSelection(account)}
                >
                  <DerivAccountCard
                    selected={
                      selectedDerivAccount?.accountId === account.accountId
                    }
                    derivAccount={account}
                  />
                </div>
              ));
            }}
          />

          <Button
            disabled={!selectedDerivAccount}
            className="btn-secondary w-full"
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      ) : step === 2 ? (
        <div className="mt-4 space-y-3">
          <p className="text-12-medium opacity-75">
            Please select the bank account you wish to recieve your payment
          </p>

          <DataRenderer
            data={bankAccountsRes.data}
            success={bankAccountsRes.success}
            error={bankAccountsRes.error}
            render={(derivAccounts) => {
              return derivAccounts.map((account) => (
                <div
                  className="relative cursor-default active:top-0.5"
                  key={account.accountNumber + account.bankCode}
                  onClick={() => handleBankAccountSelection(account)}
                >
                  <BankAccountCard
                    removeable={false}
                    bankAccount={account}
                    selected={
                      selectedBankAccount?.accountNumber ===
                        account.accountNumber &&
                      selectedBankAccount.bankCode === account.bankCode
                    }
                  />
                </div>
              ));
            }}
          />

          <Button
            disabled={!selectedBankAccount || !selectedDerivAccount}
            className="btn-secondary w-full"
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div>
            <p>Withdrawal from</p>

            <DerivAccountCard derivAccount={selectedDerivAccount!} />
          </div>

          <div>
            <p>To naira account</p>

            <BankAccountCard
              bankAccount={selectedBankAccount!}
              removeable={false}
            />
          </div>

          <div className="space-y-3">
            <div className="bg-white_dark-black-1 flex items-center rounded-xl px-2 py-2">
              <label
                htmlFor="withdrawal-amount"
                className="text-14-medium shrink-0 opacity-40"
              >
                {selectedDerivAccount?.currency} &nbsp; |
              </label>
              <Input
                id="withdrawal-amount"
                className="inputClass no-spinners"
                type="number"
                value={withdrawalAmount}
                onChange={handleWithdrawalAmountChange}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onInput={(e) => {
                  // cleans up pasted value
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[eE+-]/g,
                    ""
                  );
                }}
              />
            </div>

            <p>
              {
                // Todo: Get convertedAmount from server
              }

              {`You will recieve: ${convertedAmount} naira`}
            </p>
          </div>

          {errorMessage && <div className="form-error">{errorMessage}</div>}

          <CustomButton
            disabled={
              !selectedBankAccount || !selectedDerivAccount || !withdrawalAmount
            }
            className="btn-secondary mt-4 w-full"
            onClick={onSubmit}
            isLoading={isLoading}
          >
            Continue to payment
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default DerivWithdrawalFlow;
