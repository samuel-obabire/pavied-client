import { redirect } from "next/navigation";
import DerivWithdrawalFlow from "@/components/WithdrawalFlow";
import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { fetchCachedRates } from "@/lib/actions/rate.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DerivDepositPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  const [derivAccountsRes, bankAccountRes, rateRes] = await Promise.all([
    getUserDerivAccounts(user.id, { onlyActive: true }),
    getUserBankAccounts(user.id, { onlyActive: true }),
    fetchCachedRates(),
  ]);

  return (
    <>
      <header>
        <h1 className="text-14-medium md:text-16-medium">
          Withdraw from your deriv account
        </h1>
      </header>

      <section className="space-y-1 ">
        <DerivWithdrawalFlow
          derivAccountsRes={derivAccountsRes}
          bankAccountsRes={bankAccountRes}
          rateRes={rateRes}
        />
      </section>
    </>
  );
};

export default DerivDepositPage;
