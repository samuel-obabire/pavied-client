import { Suspense } from "react";
import { redirect } from "next/navigation";
import AccountCardFallback from "@/components/AccountCardFallback";
import ConnectDeriv from "@/components/ConnectDeriv";
import DataRenderer from "@/components/DataRenderer";
import DerivAccountCard from "@/components/DerivAccountCard";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const AccountList = async ({ userId }: { userId: string }) => {
  const derivAccountRes = await getUserDerivAccounts(userId);

  return (
    <div className="flex flex-col gap-4 py-2">
      <DataRenderer
        data={derivAccountRes.data}
        success={derivAccountRes.success}
        render={(derivAccounts) => {
          return derivAccounts.map((derivAccount) => {
            return (
              <DerivAccountCard
                key={derivAccount.accountId}
                derivAccount={derivAccount}
                showActive
                showContext={derivAccount.active}
              />
            );
          });
        }}
      />
    </div>
  );
};

const DerivSettingsPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="bg-white_dark-black-1 rounded-2xl p-6 md:p-8 shadow-md dark:shadow-gray-200/15 border border-gray-200/30">
        <ConnectDeriv />
      </section>

      <section className="bg-white_dark-black-1 rounded-2xl p-6 shadow-md dark:shadow-gray-200/15 border border-gray-200/30 space-y-6">
        <h2 className="text-20-medium text-black-1_dark-white">
          Previously linked accounts
        </h2>

        <Suspense fallback={<AccountCardFallback />}>
          <AccountList userId={user.id} />
        </Suspense>
      </section>
    </div>
  );
};

export default DerivSettingsPage;
