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
    <div className="flex flex-col gap-2 py-4">
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
    <main className="container space-y-8 lg:flex gap-4 justify-around md:px-4 sm:md:px-10">
      <section className="lg:max-w-md">
        <ConnectDeriv />
      </section>

      <section className="flex-1 w-full lg:max-w-sm">
        <h2 className="text-20-medium">Previously linked accounts</h2>

        <Suspense fallback={<AccountCardFallback />}>
          <AccountList userId={user.id} />
        </Suspense>
      </section>
    </main>
  );
};

export default DerivSettingsPage;
