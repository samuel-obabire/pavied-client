import { DerivAccount, BankAccount } from "@/prisma/lib/generated/prisma/client";
import BankAccountCard from "../BankAccountCard";
import CustomButton from "../CustomButton";
import DerivAccountCard from "../DerivAccountCard";
import DerivCurrencyIcon from "../DerivCurrencyIcon";
import type { WithdrawalFlowState } from "../hooks/useWithdrawalFlow";
import { Input } from "../ui/input";

const StepConfirm = ({
  state,
  onWithdrawChange,
  onConvertedChange,
  onSubmit,
  onBack,
}: {
  state: WithdrawalFlowState;
  onWithdrawChange: (v: string) => void;
  onConvertedChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) => {
  const {
    selectedBankAccount,
    selectedDerivAccount,
    withdrawalAmount,
    convertedAmount,
    isLoading,
    errorMessage,
  } = state;

  return (
    <div className="mt-4 space-y-3">
      <div>
        <p>From</p>
        <DerivAccountCard derivAccount={selectedDerivAccount as DerivAccount} />
      </div>

      <div>
        <p>To</p>
        <BankAccountCard
          bankAccount={selectedBankAccount as BankAccount}
          removeable={false}
        />
      </div>

      <div className="space-y-3">
        <div className="bg-white_dark-black-1 flex items-center rounded-xl px-2 py-2">
          <div className="text-14-medium flex shrink-0 items-center">
            <DerivCurrencyIcon
              currency={selectedDerivAccount?.currency as string}
            />{" "}
            &nbsp; |
          </div>
          <Input
            className="inputClass no-spinners"
            type="text"
            placeholder={`Enter ${selectedDerivAccount?.currency} amount`}
            value={convertedAmount}
            onChange={(e) => onConvertedChange(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(
                /[eE+-]/g,
                "",
              ))
            }
          />
        </div>

        <div className="bg-white_dark-black-1 flex items-center rounded-xl px-2 py-2">
          <div className="text-14-medium shrink-0 opacity-40">NGN &nbsp; |</div>
          <Input
            className="inputClass no-spinners"
            type="text"
            placeholder="Enter naira amount"
            value={withdrawalAmount}
            onChange={(e) => onWithdrawChange(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(
                /[eE+-]/g,
                "",
              ))
            }
          />
        </div>
      </div>

      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <div className="mt-4 grid grid-cols-2 gap-4 items-center">
        <CustomButton
          type="button"
          disabled={isLoading}
          variant="outline"
          className="w-full"
          onClick={onBack}
        >
          Back
        </CustomButton>
        <CustomButton
          disabled={
            !selectedBankAccount || !selectedDerivAccount || !withdrawalAmount
          }
          className="btn-secondary w-full"
          onClick={onSubmit}
          isLoading={isLoading}
        >
          Continue to payment
        </CustomButton>
      </div>
    </div>
  );
};

export default StepConfirm;
