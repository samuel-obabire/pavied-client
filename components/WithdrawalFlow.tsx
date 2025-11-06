"use client";

import { useRouter } from "next/navigation";
import { createDerivWithdrawalTransaction } from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";
import StepConfirm from "./deriv-withdrawal-flow/StepConfirm";
import StepSelectBankAccount from "./deriv-withdrawal-flow/StepSelectBankAccount";
import StepSelectDerivAccount from "./deriv-withdrawal-flow/StepSelectDerivAccount";
import { useWithdrawalFlow } from "./hooks/useWithdrawalFlow";

const DerivWithdrawalFlow = ({
  derivAccountsRes,
  bankAccountsRes,
  rateRes,
}: {
  derivAccountsRes: ActionResponse<DerivAccount[]>;
  bankAccountsRes: ActionResponse<BankAccount[]>;
  rateRes: ActionResponse<CurrencyConfig[]>;
}) => {
  const {
    state,
    setError,
    setLoading,
    selectBankAccount,
    selectDerivAccount,
    setStep,
    handleConvertedAmountChange,
    handleWithdrawalAmountChange,
  } = useWithdrawalFlow(rateRes);

  const router = useRouter();

  const { selectedBankAccount, selectedDerivAccount, step, convertedAmount } =
    state;

  const onSubmit = async () => {
    if (!selectedBankAccount || !selectedDerivAccount) return;

    setError("");
    setLoading(true);

    const usedRate = rateRes.data?.find(
      (config) => config.code === selectedDerivAccount.currency,
    )?.withdrawalRate;

    if (!usedRate) return setError("Unable to find payment config");

    try {
      const response = await createDerivWithdrawalTransaction({
        amount: Number(convertedAmount),
        currency: selectedDerivAccount.currency,
        derivLoginId: selectedDerivAccount.accountId,
        receivingBankAccountNumber: selectedBankAccount.accountNumber,
        receivingBankName: selectedBankAccount.bankName,
        recievingBankAccountName: selectedBankAccount.accountName,
        receivingBankCode: selectedBankAccount.bankCode,
        usedRate,
      });

      if (response.success) {
        if (response.data?.transactionId) {
          router.push(
            ROUTES.VERIFY_DERIV_WITHDRAW(response.data.transactionId),
          );
        } else {
          setError("Transaction ID is missing.");
        }

        setStep(4);
      } else if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (error) {
      setError(
        error instanceof Error && error.message
          ? error.message
          : "An error occured",
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
      onWithdrawChange={handleWithdrawalAmountChange}
      onConvertedChange={handleConvertedAmountChange}
    />
  );
};

export default DerivWithdrawalFlow;
