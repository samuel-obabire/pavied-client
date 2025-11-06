import { Suspense } from "react";
import { redirect } from "next/navigation";
import AccountCardFallback from "@/components/AccountCardFallback";
import BankAccountCard from "@/components/BankAccountCard";
import DataRenderer from "@/components/DataRenderer";
import BankAccountRegister from "@/components/forms/BankAccountRegister";
import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const AccountList = async ({ userId }: { userId: string }) => {
  const bankAccountRes = await getUserBankAccounts(userId);

  return (
    <div className="flex flex-col gap-2 py-4">
      <DataRenderer
        data={bankAccountRes.data}
        success={bankAccountRes.success}
        render={(bankAccounts) => {
          return bankAccounts.map((bankAcccount) => {
            return (
              <BankAccountCard
                key={bankAcccount.bankCode + bankAcccount.accountNumber}
                bankAccount={bankAcccount}
                showActive
              />
            );
          });
        }}
      />
    </div>
  );
};

const BankSettiingsPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  return (
    <main className="container space-y-8 lg:flex gap-4 justify-around sm:max-md:px-10">
      <section className="lg:max-w-md">
        <BankAccountRegister />
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

export default BankSettiingsPage;
