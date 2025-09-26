import { redirect } from "next/navigation";

import ConnectDeriv from "@/components/ConnectDeriv";
import SaveOnboardingStep from "@/components/SaveOnboardingStep";
import { OnboardingStep } from "@/lib/constants/onboarding";
import { ROUTES } from "@/lib/constants/routes";
import { getDerivAccounts } from "@/lib/firebase/deriv";
import { verifySession } from "@/lib/server";

const OnboardDerivPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  const derivAccounts = await getDerivAccounts(user.id);

  return (
    <main className="flex-center container mt-8 max-w-lg flex-col  space-y-14">
      <ConnectDeriv existingDerivAccounts={derivAccounts} />

      <section className="flex w-full justify-end">
        <SaveOnboardingStep
          label={derivAccounts.length ? "Continue" : "Skip, and do it later"}
          nextRoute="ONBOARD_BANK"
          onboardingStep={OnboardingStep.SETUP_BANK}
        />
      </section>
    </main>
  );
};

export default OnboardDerivPage;
