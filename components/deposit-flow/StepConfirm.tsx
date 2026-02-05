import BankAccountCard from "../BankAccountCard";
import CustomButton from "../CustomButton";
import DerivAccountCard from "../DerivAccountCard";
import DerivCurrencyIcon from "../DerivCurrencyIcon";
import type { DepositFlowState } from "../hooks/useDepositFlow";
import { Input } from "../ui/input";

const StepConfirm = ({
  state,
  onDepositChange,
  onConvertedChange,
  onSubmit,
  onBack,
}: {
  state: DepositFlowState;
  onDepositChange: (v: string) => void;
  onConvertedChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) => {
  const {
    selectedBankAccount,
    selectedDerivAccount,
    depositAmount,
    convertedAmount,
    isLoading,
    errorMessage,
  } = state;

  return (
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
          <div className="text-14-medium flex shrink-0 items-center">
            <DerivCurrencyIcon
              currency={selectedDerivAccount?.currency as string}
            />{" "}
            &nbsp; |
          </div>
          <Input
            className="inputClass no-spinners"
            type="text"
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
            value={depositAmount}
            onChange={(e) => onDepositChange(e.target.value)}
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

      <div className="mt-4 grid grid-cols-2 gap-4">
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
            !selectedBankAccount || !selectedDerivAccount || !depositAmount
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
