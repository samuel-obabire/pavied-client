import { redirect } from "next/navigation";

import AddAccountHeader from "@/components/AddAccountHeader";
import DerivAccountCard from "@/components/DerivAccountCard";
import DerivAccountRegister from "@/components/forms/DerivAccountRegister";
import { ROUTES } from "@/lib/constants";
import { getUserDerivAccounts } from "@/lib/firebase/user";
import { verifySession } from "@/lib/server";

const page = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  const derivAccounts = await getUserDerivAccounts(user.id);

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
          <DerivAccountRegister />
        </section>
      </div>
    </main>
  );
};

export default page;
