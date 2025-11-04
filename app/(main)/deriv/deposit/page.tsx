import { redirect } from "next/navigation";
import DepositFlow from "@/components/deposit-flow/DepositFlow";
import ExchangeRateList from "@/components/ExchangeRateList";
import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { fetchRates } from "@/lib/actions/rate.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DerivDepositPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const [derivAccountsRes, bankAccountRes, rateRes] = await Promise.all([
    getUserDerivAccounts(user.id),
    getUserBankAccounts(user.id),
    fetchRates(),
  ]);

  return (
    <div className="justify-around gap-4 space-y-6 overflow-y-auto min-sm:max-md:px-20 lg:flex ">
      <div className="grow space-y-3 max-w-lg">
        <header>
          <h1 className="text-14-medium md:text-16-medium">
            Deposit to deriv account
          </h1>
        </header>

        <section className="space-y-1">
          <DepositFlow
            derivAccountsRes={derivAccountsRes}
            bankAccountsRes={bankAccountRes}
            rateRes={rateRes}
          />
        </section>
      </div>

      <ExchangeRateList rateRes={rateRes} />
    </div>
  );
};

export default DerivDepositPage;
