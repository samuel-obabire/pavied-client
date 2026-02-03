import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { fetchCachedRates } from "@/lib/actions/rate.action";
import DepositFlow from "./DepositFlow";

const ConnectedDepositFlow = async ({ userId }: { userId: string }) => {
  const [derivAccountsRes, bankAccountRes, rateRes] = await Promise.all([
    getUserDerivAccounts(userId, { onlyActive: true }),
    getUserBankAccounts(userId, { onlyActive: true }),
    fetchCachedRates(),
  ]);

  return (
    <DepositFlow
      derivAccountsRes={derivAccountsRes}
      bankAccountsRes={bankAccountRes}
      rateRes={rateRes}
    />
  );
};

export default ConnectedDepositFlow;
