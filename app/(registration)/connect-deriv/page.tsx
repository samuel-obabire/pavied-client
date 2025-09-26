import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AddAccountHeader from "@/components/AddAccountHeader";
import ConnectDeriv from "@/components/ConnectDeriv";
import DerivAccountCard from "@/components/DerivAccountCard";
import DerivAccountSelectionList from "@/components/DerivAccountSelectionList";
import { ROUTES } from "@/lib/constants/routes";
import { getDerivAccounts } from "@/lib/firebase/deriv";
import { verifySession } from "@/lib/server";
import { parseSelectedDerivAccounts } from "@/lib/utils/deriv";

const ConnectDerivPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  const cookieStore = await cookies();

  const derivAccounts = cookieStore.get("deriv-accounts")?.value ?? "";
  const parsedAccounts = parseSelectedDerivAccounts(derivAccounts);

  const existingDerivAccounts = await getDerivAccounts(user.id);

  return (
    <main className="flex-center container mt-8 max-w-lg flex-col  space-y-14">
      {!parsedAccounts.length ? (
        <ConnectDeriv existingDerivAccounts={existingDerivAccounts} />
      ) : (
        <div className="w-full space-y-8">
          <div className="mt-6">
            <AddAccountHeader
              title="Add deriv account"
              drawerTitle="Previously added deriv accounts"
              triggerLabel="My accounts"
              drawerContent={
                <DerivAccountCard derivAccounts={existingDerivAccounts} />
              }
            />
          </div>

          <section className="space-y-4">
            <DerivAccountSelectionList parsedAccounts={parsedAccounts} />
          </section>
        </div>
      )}
    </main>
  );
};

export default ConnectDerivPage;
