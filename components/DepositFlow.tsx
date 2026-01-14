"use client";
import { useRouter } from "next/navigation";
import { createDerivDepositTransaction } from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";
import { RequestError } from "@/lib/http-errors";
import { useDepositFlow } from "./hooks/useDepositFlow";
import StepConfirm from "./StepConfirm";
import StepSelectBankAccount from "./StepSelectBankAccount";
import StepSelectDerivAccount from "./StepSelectDerivAccount";

const DepositFlow = ({
  derivAccountsRes,
  bankAccountsRes,
  rateRes,
}: {
  derivAccountsRes: ActionResponse<DerivAccount[]>;
  bankAccountsRes: ActionResponse<BankAccount[]>;
  rateRes: ActionResponse<CurrencyConfig[]>;
}) => {
  const {
    handleConvertedAmountChange,
    handleDepositAmountChange,
    selectBankAccount,
    selectDerivAccount,
    setError,
    setLoading,
    state,
    setStep,
  } = useDepositFlow(rateRes);
  const router = useRouter();

  const { step, selectedDerivAccount, selectedBankAccount, depositAmount } =
    state;

  const onSubmit = async () => {
    if (!selectedBankAccount || !selectedDerivAccount) return;

    setError("");
    setLoading(true);

    const usedRate = rateRes.data?.find(
      (config) => config.code === selectedDerivAccount.currency,
    )?.depositRate;

    if (!usedRate) return setError("Unable to find payment config");

    try {
      const response = await createDerivDepositTransaction({
        currency: selectedDerivAccount.currency,
        derivLoginId: selectedDerivAccount.accountId,
        paidFromAccountName: selectedBankAccount.accountName,
        paidFromAccountNumber: selectedBankAccount.accountNumber,
        paidFromBankCode: selectedBankAccount.bankCode,
        paidFromBankName: selectedBankAccount.bankName,
        amount: Number(depositAmount),
        usedRate,
      });

      if (response.success) {
        if (response.data?.transactionId) {
          router.push(ROUTES.PAYMENT(response.data.transactionId));
        } else {
          setError("Transaction ID is missing");
        }
      } else if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (error) {
      setError(
        error instanceof RequestError
          ? error.message
          : error instanceof Error
            ? error.message
            : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return step === 1 ? (
    <StepSelectDerivAccount
      onNext={setStep}
      selectedDerivAccount={state.selectedDerivAccount}
      derivAccountsRes={derivAccountsRes}
      onSelect={selectDerivAccount}
    />
  ) : step === 2 ? (
    <StepSelectBankAccount
      onNext={setStep}
      selectedBankAccount={state.selectedBankAccount}
      bankAccountsRes={bankAccountsRes}
      onSelect={selectBankAccount}
    />
  ) : (
    <StepConfirm
      state={state}
      onSubmit={onSubmit}
      onDepositChange={handleDepositAmountChange}
      onConvertedChange={handleConvertedAmountChange}
    />
  );
};

export default DepositFlow;
