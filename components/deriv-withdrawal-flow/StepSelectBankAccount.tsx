/** biome-ignore-all lint/a11y/noStaticElementInteractions: ignore noStatic */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: ignore useKeyWithClickEvents */
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import BankAccountCard from "../BankAccountCard";
import DataRenderer from "../DataRenderer";
import { Button } from "../ui/button";

const StepSelectBankAccount = ({
  bankAccountsRes,
  onSelect,
  selectedBankAccount,
  onNext,
  onBack,
}: {
  bankAccountsRes: ActionResponse<BankAccount[]>;
  onSelect: (acc: BankAccount) => void;
  selectedBankAccount: BankAccount | null;
  onNext: (step: number) => void;
  onBack: () => void;
}) => {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-12-medium opacity-75">
        Please select the bank account you are going to make the payment from
      </p>

      <DataRenderer
        data={bankAccountsRes.data}
        success={bankAccountsRes.success}
        empty={{
          title: "No active bank account!",
          message:
            "You can only send funds from a bank account we have verified.",
          action: (
            <Link href={ROUTES.SETUP_BANK}>
              <Button>Add new account</Button>
            </Link>
          ),
        }}
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

      <div className="grid grid-cols-2 gap-4 items-center">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          disabled={!selectedBankAccount}
          className="btn-secondary w-full"
          onClick={() => onNext(3)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepSelectBankAccount;
