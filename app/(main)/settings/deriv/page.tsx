import { redirect } from "next/navigation";

import AddAccountHeader from "@/components/AddAccountHeader";
import ConnectDeriv from "@/components/ConnectDeriv";
import DerivAccountCard from "@/components/DerivAccountCard";
import { ROUTES } from "@/lib/constants/routes";
import { getDerivAccounts } from "@/lib/firebase/deriv";
import { verifySession } from "@/lib/server";

const DerivSettingsPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  const derivAccounts = await getDerivAccounts(user.id);

  return (
    <main className="flex-center container max-w-lg flex-col space-y-6  md:ml-20 md:flex">
      <div className="w-full">
        <div className="mt-6">
          <AddAccountHeader
            title="Add deriv account"
            drawerTitle="Previously added deriv accounts"
            triggerLabel="My accounts"
            drawerContent={<DerivAccountCard derivAccounts={derivAccounts} />}
          />
        </div>

        <section>
          <ConnectDeriv existingDerivAccounts={derivAccounts} />
        </section>
      </div>
    </main>
  );
};

export default DerivSettingsPage;
