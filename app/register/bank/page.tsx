import { redirect } from "next/navigation";

import AddAccountHeader from "@/components/AddAccountHeader";
import BankAccountCard from "@/components/BankAccountCard";
import BankAccountRegister from "@/components/forms/BankAccountRegister";
import { ROUTES } from "@/lib/constants";
import { getUserBankAccounts } from "@/lib/firebase/user";
import { getSession } from "@/lib/server";

const page = async () => {
  const user = await getSession();

  if (!user?.id) redirect(ROUTES.HOME);

  const bankAccounts = await getUserBankAccounts(user?.id);

  return (
    <main className="flex-center container max-w-lg flex-col  space-y-6 md:flex md:h-screen">
      <div className="w-full">
        <div className="mt-6">
          <AddAccountHeader
            title="Add bank account"
            drawerTitle="Previously added bank accounts"
            triggerLabel="My accounts"
            drawerContent={<BankAccountCard bankAccounts={bankAccounts} />}
          />
        </div>

        <section>
          <BankAccountRegister />
        </section>
      </div>
    </main>
  );
};

export default page;
