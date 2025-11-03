/** biome-ignore-all lint/a11y/noStaticElementInteractions: ignore noStatic */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: ignore useKeyWithClickEvents */
"use client";
import { type ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createDerivDepositTransaction } from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";
import { RequestError } from "@/lib/http-errors";
import BankAccountCard from "./BankAccountCard";
import CustomButton from "./CustomButton";
import DataRenderer from "./DataRenderer";
import DerivAccountCard from "./DerivAccountCard";
import { exchangeRates } from "./ExchangeRateList";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const DepositFlow = ({
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

  const [depositAmount, setDepositAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const router = useRouter();

  const onSubmit = async () => {
    if (!selectedBankAccount || !selectedDerivAccount) return;

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await createDerivDepositTransaction({
        currency: selectedDerivAccount.currency,
        derivLoginId: selectedDerivAccount.accountId,
        paidFromAccountName: selectedBankAccount.accountName,
        paidFromAccountNumber: selectedBankAccount.accountNumber,
        paidFromBankCode: selectedBankAccount.bankCode,
        paidFromBankName: selectedBankAccount.bankName,
        amount: Number(depositAmount),
      });

      if (response.success) {
        if (response.data?.transactionId) {
          router.push(ROUTES.PAYMENT(response.data.transactionId));
        } else {
          setErrorMessage("Transaction ID is missing.");
        }
      } else if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (error) {
      if (error instanceof RequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          error instanceof Error && error.message
            ? error.message
            : "An error occured",
        );
      }
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

  const handleDepositAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setDepositAmount(value);

    const s = exchangeRates.find(
      (ex) => ex.currency === selectedDerivAccount?.currency,
    );

    const convertedAmount = s ? Number(value) / s.deposit : 0;

    setConvertedAmount(convertedAmount);
  };

  return step === 1 ? (
    <div className="mt-4 space-y-3">
      <p className="text-12-medium opacity-75">
        Please select the deriv account you want to fund
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
                selected={selectedDerivAccount?.accountId === account.accountId}
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
        Please select the bank account you are going to make the payment from
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
        <p>From</p>

        <BankAccountCard
          bankAccount={selectedBankAccount as BankAccount}
          removeable={false}
        />
      </div>

      <div>
        <p>To</p>

        <DerivAccountCard derivAccount={selectedDerivAccount as DerivAccount} />
      </div>

      <div className="space-y-3">
        <div className="bg-white_dark-black-1 flex items-center rounded-xl px-2 py-2">
          <label
            htmlFor="deposit-amount"
            className="text-14-medium shrink-0 opacity-40"
          >
            NGN &nbsp; |
          </label>
          <Input
            id="deposit-amount"
            className="inputClass no-spinners"
            type="number"
            value={depositAmount}
            onChange={handleDepositAmountChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onInput={(e) => {
              // cleans up pasted value
              e.currentTarget.value = e.currentTarget.value.replace(
                /[eE+-]/g,
                "",
              );
            }}
          />
        </div>

        <p>
          {
            // Todo: Get convertedAmount from server
          }

          {`You will recieve: ${convertedAmount} ${selectedDerivAccount?.currency}`}
        </p>
      </div>

      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <CustomButton
        disabled={
          !selectedBankAccount || !selectedDerivAccount || !depositAmount
        }
        className="btn-secondary mt-4 w-full"
        onClick={onSubmit}
        isLoading={isLoading}
      >
        Continue to payment
      </CustomButton>
    </div>
  );
};

export default DepositFlow;
