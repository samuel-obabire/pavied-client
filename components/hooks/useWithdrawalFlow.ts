import { useCallback, useState } from "react";
import { sanitizeTwoDecimals, truncateTo2 } from "@/lib/utils";

export type WithdrawalFlowState = {
  step: number;
  isLoading: boolean;
  errorMessage: string;
  selectedDerivAccount: DerivAccount | null;
  selectedBankAccount: BankAccount | null;
  withdrawalAmount: string;
  convertedAmount: string;
};

export function useWithdrawalFlow(rateRes: ActionResponse<CurrencyConfig[]>) {
  const [step, setStep] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDerivAccount, setSelectedDerivAccount] =
    useState<DerivAccount | null>(null);
  const [selectedBankAccount, setSelectedBankAccount] =
    useState<BankAccount | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");

  const setError = useCallback((msg: string) => {
    setErrorMessage(msg);
  }, []);

  const selectDerivAccount = useCallback((acc: DerivAccount) => {
    setSelectedDerivAccount((prev) =>
      prev?.accountId === acc.accountId ? null : acc,
    );
  }, []);

  const selectBankAccount = useCallback((acc: BankAccount) => {
    setSelectedBankAccount((prev) =>
      prev?.accountNumber === acc.accountNumber &&
      prev.bankCode === acc.bankCode
        ? null
        : acc,
    );
  }, []);

  const handleWithdrawalAmountChange = useCallback(
    (value: string) => {
      const clean = sanitizeTwoDecimals(value);

      const rate = selectedDerivAccount
        ? rateRes.data?.find(
            (ex) => ex.code === selectedDerivAccount?.currency,
          )
        : null;

      if (!rate || clean === "") {
        setWithdrawalAmount(clean);
        if (clean === "") setConvertedAmount("");
        return;
      }

      const withdrawalRate = rate.withdrawalRate;
      setWithdrawalAmount(clean);
      setConvertedAmount(
        truncateTo2(Number.parseFloat(clean) / withdrawalRate),
      );
    },
    [rateRes, selectedDerivAccount],
  );

  const handleConvertedAmountChange = useCallback(
    (value: string) => {
      const clean = sanitizeTwoDecimals(value);

      const rate = selectedDerivAccount
        ? rateRes.data?.find(
            (ex) => ex.code === selectedDerivAccount?.currency,
          )
        : null;

      if (!rate || clean === "") {
        setConvertedAmount(clean);
        if (clean === "") setWithdrawalAmount("");
        return;
      }

      const withdrawalRate = rate.withdrawalRate;
      setConvertedAmount(clean);
      setWithdrawalAmount(
        truncateTo2(Number.parseFloat(clean) * withdrawalRate),
      );
    },
    [rateRes, selectedDerivAccount],
  );

  const state: WithdrawalFlowState = {
    step,
    isLoading,
    errorMessage,
    selectedDerivAccount,
    selectedBankAccount,
    withdrawalAmount,
    convertedAmount,
  };

  return {
    state,
    setStep,
    setLoading,
    setError,
    selectDerivAccount,
    selectBankAccount,
    handleWithdrawalAmountChange,
    handleConvertedAmountChange,
  } as const;
}
