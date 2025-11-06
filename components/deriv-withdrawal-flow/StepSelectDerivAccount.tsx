/** biome-ignore-all lint/a11y/noStaticElementInteractions: ignore noStatic */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: ignore useKeyWithClickEvents */

import DataRenderer from "../DataRenderer";
import DerivAccountCard from "../DerivAccountCard";
import { Button } from "../ui/button";

const StepSelectDerivAccount = ({
  derivAccountsRes,
  onSelect,
  selectedDerivAccount,
  onNext,
}: {
  derivAccountsRes: ActionResponse<DerivAccount[]>;
  selectedDerivAccount: DerivAccount | null;
  onSelect: (acc: DerivAccount) => void;
  onNext: (step: number) => void;
}) => {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-12-medium opacity-75">
        Please select the deriv account you want to fund
      </p>

      <DataRenderer
        data={derivAccountsRes.data}
        success={derivAccountsRes.success}
        empty={{
          title: "No active accounts",
          mesage: "You can only withdraw from an activated account",
        }}
        error={derivAccountsRes.error}
        render={(derivAccounts) =>
          derivAccounts.map((account) => (
            <div
              className="relative cursor-pointer active:top-0.5"
              key={account.accountId}
              onClick={() => onSelect(account)}
            >
              <DerivAccountCard
                selected={selectedDerivAccount?.accountId === account.accountId}
                derivAccount={account}
              />
            </div>
          ))
        }
      />

      <Button
        disabled={!selectedDerivAccount}
        className="btn-secondary w-full"
        onClick={() => onNext(2)}
      >
        Next
      </Button>
    </div>
  );
};

export default StepSelectDerivAccount;
