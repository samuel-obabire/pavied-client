import { redirect } from "next/navigation";
import AddAccountHeader from "@/components/AddAccountHeader";
import BankAccountCard from "@/components/BankAccountCard";
import DataRenderer from "@/components/DataRenderer";
import BankAccountRegister from "@/components/forms/BankAccountRegister";
import SaveOnboardingStep from "@/components/SaveOnboardingStep";
import { getUserBankAccounts } from "@/lib/actions/bank.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";
import { OnboardingStep } from "@/prisma/lib/generated/prisma/enums";

const BankAccountOnboardingPage = async () => {
  const session = await verifySession();
  const user = session?.user;

  if (!user?.id) redirect(ROUTES.HOME);

  const bankAccountRes = await getUserBankAccounts(user?.id);

  return (
    <main className="flex-center container max-w-lg flex-col  space-y-6">
      <div className="w-full">
        <div className="mt-6">
          <AddAccountHeader
            title="Add bank account"
            drawerTitle="Previously added bank accounts"
            triggerLabel="My accounts"
            drawerContent={
              <DataRenderer
                data={bankAccountRes.data}
                success={bankAccountRes.success}
                render={(bankAccounts) => {
                  return bankAccounts.map((bankAcccount) => {
                    return (
                      <BankAccountCard
                        key={bankAcccount.bankCode + bankAcccount.accountNumber}
                        bankAccount={bankAcccount}
                        removeable
                      />
                    );
                  });
                }}
              />
            }
          />
        </div>

        <section>
          <BankAccountRegister />
        </section>
      </div>

      <section className="flex w-full justify-end">
        <SaveOnboardingStep
          label={
            bankAccountRes?.data?.length
              ? "Continue"
              : "Finish, and do it later"
          }
          nextRoute="DASHBOARD"
          onboardingStep={OnboardingStep.COMPLETE}
        />
      </section>
    </main>
  );
};

export default BankAccountOnboardingPage;
