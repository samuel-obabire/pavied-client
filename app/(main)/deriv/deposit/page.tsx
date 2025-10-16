import { redirect } from "next/navigation";

import DepositFlow from "@/components/DepositFlow";
// import ExchangeRateList from "@/components/ExchangeRateList";
import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DerivDepositPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const derivAccountsRes = await getUserDerivAccounts(user.id);
  const bankAccountRes = await getUserBankAccounts(user.id);

  return (
    <div className="w-full gap-4 space-y-6 overflow-y-auto sm:max-w-md">
      <div className="space-y-3">
        <header>
          <h1 className="text-14-medium md:text-16-medium">
            Deposit to deriv account
          </h1>
        </header>

        <section className="space-y-1">
          <DepositFlow
            derivAccountsRes={derivAccountsRes}
            bankAccountsRes={bankAccountRes}
          />
        </section>
      </div>

      {/* <ExchangeRateList /> */}
    </div>
  );
};

export default DerivDepositPage;
