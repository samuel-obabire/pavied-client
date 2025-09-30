import { redirect } from "next/navigation";

import BankAccountRegister from "@/components/forms/BankAccountRegister";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const BankSettiingsPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  return (
    <main className="flex-center container max-w-lg flex-col space-y-6  md:ml-20 md:flex ">
      <div className="w-full">
        <div className="my-6">Add bank account</div>

        <section>
          <BankAccountRegister />
        </section>
      </div>
    </main>
  );
};

export default BankSettiingsPage;
