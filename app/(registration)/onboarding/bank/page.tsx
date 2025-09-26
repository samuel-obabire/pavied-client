import { redirect } from "next/navigation";

import AddAccountHeader from "@/components/AddAccountHeader";
import BankAccountCard from "@/components/BankAccountCard";
import BankAccountRegister from "@/components/forms/BankAccountRegister";
import SaveOnboardingStep from "@/components/SaveOnboardingStep";
import { OnboardingStep } from "@/lib/constants/onboarding";
import { ROUTES } from "@/lib/constants/routes";
import { getBankAccounts } from "@/lib/firebase/bank";
import { verifySession } from "@/lib/server";

const BankAccountOnboardingPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  const bankAccounts = await getBankAccounts(user?.id);

  return (
    <main className="flex-center container max-w-lg flex-col  space-y-6">
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

      <section className="flex w-full justify-end">
        <SaveOnboardingStep
          label={bankAccounts.length ? "Continue" : "Finish, and do it later"}
          nextRoute="DASHBOARD"
          onboardingStep={OnboardingStep.COMPLETE}
        />
      </section>
    </main>
  );
};

export default BankAccountOnboardingPage;
