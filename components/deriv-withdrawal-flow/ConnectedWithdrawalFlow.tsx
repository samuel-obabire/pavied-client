import DerivWithdrawalFlow from "@/components/WithdrawalFlow";
import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { fetchCachedRates } from "@/lib/actions/rate.action";

const ConnectedWithdrawalFlow = async ({ userId }: { userId: string }) => {
  const [derivAccountsRes, bankAccountRes, rateRes] = await Promise.all([
    getUserDerivAccounts(userId, { onlyActive: true }),
    getUserBankAccounts(userId, { onlyActive: true }),
    fetchCachedRates(),
  ]);

  return (
    <DerivWithdrawalFlow
      derivAccountsRes={derivAccountsRes}
      bankAccountsRes={bankAccountRes}
      rateRes={rateRes}
    />
  );
};

export default ConnectedWithdrawalFlow;
