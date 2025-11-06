import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ConnectDeriv from "@/components/ConnectDeriv";
import DerivAccountSelectionList from "@/components/DerivAccountSelectionList";
import SaveOnboardingStep from "@/components/SaveOnboardingStep";
import { getUserDerivAccounts } from "@/lib/actions/deriv.action";
import { OnboardingStep } from "@/lib/constants/onboarding";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";
import { parseSelectedDerivAccounts } from "@/lib/utils/deriv";

const OnboardDerivPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.HOME);

  const { success, data } = await getUserDerivAccounts(user.id);

  if (!success || !data) return null;

  const cookieStore = await cookies();
  const derivAccounts = cookieStore.get("deriv-accounts")?.value ?? "";

  const parsedAccounts = parseSelectedDerivAccounts(derivAccounts);

  return (
    <main className="flex-center container mt-8 max-w-lg flex-col  space-y-14">
      {!parsedAccounts.length ? (
        <ConnectDeriv />
      ) : (
        <div className="w-full space-y-8">
          <div className="mt-6">Add deriv account</div>

          <section className="space-y-4">
            <DerivAccountSelectionList parsedAccounts={parsedAccounts} />
          </section>
        </div>
      )}

      <section className="flex w-full justify-end">
        <SaveOnboardingStep
          label={data.length ? "Continue" : "Skip, and do it later"}
          nextRoute="ONBOARD_BANK"
          onboardingStep={OnboardingStep.SETUP_BANK}
        />
      </section>
    </main>
  );
};

export default OnboardDerivPage;
