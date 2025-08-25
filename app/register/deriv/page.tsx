import { redirect } from "next/navigation";

import AddAccountHeader from "@/components/AddAccountHeader";
import DerivAccountCard from "@/components/DerivAccountCard";
import DerivAccountRegister from "@/components/forms/DerivAccountRegister";
import { ROUTES } from "@/lib/constants";
import { getUserDerivAccounts } from "@/lib/firebase/user";
import { getSession } from "@/lib/server";

const page = async () => {
  const user = await getSession();

  if (!user?.id) redirect(ROUTES.HOME);

  const derivAccounts = await getUserDerivAccounts(user.id);

  return (
    <main className="flex-center container max-w-lg flex-col  space-y-6 md:flex md:h-screen">
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
