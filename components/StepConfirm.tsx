import BankAccountCard from "./BankAccountCard";
import CustomButton from "./CustomButton";
import DerivAccountCard from "./DerivAccountCard";
import DerivCurrencyIcon from "./DerivCurrencyIcon";
import type { DepositFlowState } from "./hooks/useDepositFlow";
import { Input } from "./ui/input";

const StepConfirm = ({
  state,
  onDepositChange,
  onConvertedChange,
  onSubmit,
}: {
  state: DepositFlowState;
  onDepositChange: (v: string) => void;
  onConvertedChange: (v: string) => void;
  onSubmit: () => void;
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
          bankAccount={selectedBankAccount!}
          removeable={false}
        />
      </div>

      <div>
        <p>To</p>
        <DerivAccountCard derivAccount={selectedDerivAccount!} />
      </div>

      <div className="space-y-3">
        <div className="bg-white_dark-black-1 flex items-center rounded-xl px-2 py-2">
          <label className="text-14-medium flex shrink-0 items-center">
            <DerivCurrencyIcon
              currency={selectedDerivAccount?.currency as string}
            />{" "}
            &nbsp; |
          </label>
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
          <label className="text-14-medium shrink-0 opacity-40">
            NGN &nbsp; |
          </label>
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

export default StepConfirm;
