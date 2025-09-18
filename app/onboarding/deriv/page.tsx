import { redirect } from "next/navigation";

import AddAccountHeader from "@/components/AddAccountHeader";
import DerivAccountCard from "@/components/DerivAccountCard";
import DerivAccountRegister from "@/components/forms/DerivAccountRegister";
import SaveStepFooter from "@/components/SaveStepFooter";
import { OnboardingStep } from "@/lib/constants/onBoardingStep";
import { ROUTES } from "@/lib/constants/routes";
import { getUserDerivAccounts } from "@/lib/firebase/user";
import { verifySession } from "@/lib/server";

const page = async () => {
  const user = await verifySession();

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

      <section className="flex w-full justify-end">
        <SaveStepFooter
          label={derivAccounts.length ? "Continue" : "Skip, and do it later"}
          nextRoute="ONBOARD_BANK"
          onboardingStep={OnboardingStep.SETUP_BANK}
        />
      </section>
    </main>
  );
};

export default page;
