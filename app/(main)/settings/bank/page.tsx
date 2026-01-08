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
    <div className="flex flex-col gap-4 py-2">
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="bg-white_dark-black-1 rounded-2xl p-6 shadow-md dark:shadow-gray-200/15 border border-gray-200/30">
        <BankAccountRegister />
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

export default BankSettiingsPage;
