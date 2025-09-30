import { redirect } from "next/navigation";

import ConnectDeriv from "@/components/ConnectDeriv";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const DerivSettingsPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  return (
    <main className="flex-center container max-w-lg flex-col space-y-6  md:ml-20 md:flex">
      <div className="w-full">
        <section>
          <ConnectDeriv />
        </section>
      </div>
    </main>
  );
};

export default DerivSettingsPage;
