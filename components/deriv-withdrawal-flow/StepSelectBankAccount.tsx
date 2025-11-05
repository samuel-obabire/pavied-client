/** biome-ignore-all lint/a11y/noStaticElementInteractions: ignore noStatic */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: ignore useKeyWithClickEvents */
import BankAccountCard from "../BankAccountCard";
import DataRenderer from "../DataRenderer";
import { Button } from "../ui/button";

const StepSelectBankAccount = ({
  bankAccountsRes,
  onSelect,
  selectedBankAccount,
  onNext,
}: {
  bankAccountsRes: ActionResponse<BankAccount[]>;
  onSelect: (acc: BankAccount) => void;
  selectedBankAccount: BankAccount | null;
  onNext: (step: number) => void;
}) => {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-12-medium opacity-75">
        Please select the bank account you are going to make the payment from
      </p>

      <DataRenderer
        data={bankAccountsRes.data}
        success={bankAccountsRes.success}
        error={bankAccountsRes.error}
        render={(bankAccounts) =>
          bankAccounts.map((account) => (
            <div
              className="relative cursor-pointer active:top-0.5"
              key={account.accountNumber + account.bankCode}
              onClick={() => onSelect(account)}
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
          ))
        }
      />

      <Button
        disabled={!selectedBankAccount}
        className="btn-secondary w-full"
        onClick={() => onNext(3)}
      >
        Next
      </Button>
    </div>
  );
};

export default StepSelectBankAccount;
