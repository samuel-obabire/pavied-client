import BrandName from "@/components/BrandName";
import BioRegister from "@/components/forms/BioResgister";
import SaveStepFooter from "@/components/SaveStepFooter";
import { OnboardingStep } from "@/lib/constants/onBoardingStep";

const page = () => {
  return (
    <main className="container max-w-lg space-y-6  pt-8">
      <header className="space-y-5">
        <div className="mb-8 text-center">
          <BrandName />
        </div>

        <h1 className="text-28-bold text-primary dark:text-white">
          Register <span className="text-secondary">account</span>
        </h1>
        <p>
          Please ensure you provide your legal name as it appears on your
          government issued ID
        </p>
      </header>

      <section>
        <BioRegister />
      </section>

      <section className="flex w-full justify-end">
        <SaveStepFooter
          label="Continue to next step"
          nextRoute="ONBOARD_DERIV"
          onboardingStep={OnboardingStep.SETUP_DERIV}
        />
      </section>
    </main>
  );
};

export default page;
