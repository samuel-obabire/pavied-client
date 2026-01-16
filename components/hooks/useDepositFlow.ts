import { useCallback, useState } from "react";
import { sanitizeTwoDecimals, truncateTo2 } from "@/lib/utils";

export type DepositFlowState = {
  step: number;
  isLoading: boolean;
  errorMessage: string;
  selectedDerivAccount: DerivAccount | null;
  selectedBankAccount: BankAccount | null;
  depositAmount: string;
  convertedAmount: string;
};

export function useDepositFlow(rateRes: ActionResponse<CurrencyConfig[]>) {
  const [step, setStep] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDerivAccount, setSelectedDerivAccount] =
    useState<DerivAccount | null>(null);
  const [selectedBankAccount, setSelectedBankAccount] =
    useState<BankAccount | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
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

  const handleDepositAmountChange = useCallback(
    (value: string) => {
      const clean = sanitizeTwoDecimals(value);

      const rate = selectedDerivAccount
        ? rateRes.data?.find(
            (ex) => ex.code === selectedDerivAccount?.currency,
          )
        : null;

      if (!rate || clean === "") {
        setDepositAmount(clean); // Allow clearing or partial typing even if no rate
        if (clean === "") setConvertedAmount("");
        return;
      }

      const depositRate = rate.depositRate;
      setDepositAmount(clean);
      setConvertedAmount(truncateTo2(Number.parseFloat(clean) / depositRate));
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
        if (clean === "") setDepositAmount("");
        return;
      }

      const depositRate = rate.depositRate;
      setConvertedAmount(clean);
      setDepositAmount(truncateTo2(Number.parseFloat(clean) * depositRate));
    },
    [rateRes, selectedDerivAccount],
  );

  // Construct state object to match previous interface
  const state: DepositFlowState = {
    step,
    isLoading,
    errorMessage,
    selectedDerivAccount,
    selectedBankAccount,
    depositAmount,
    convertedAmount,
  };

  return {
    state,
    setStep,
    setLoading,
    setError,
    selectDerivAccount,
    selectBankAccount,
    handleDepositAmountChange,
    handleConvertedAmountChange,
  } as const;
}
