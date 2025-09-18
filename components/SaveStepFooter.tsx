"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { updateOnboardingStep } from "@/lib/actions/onboadingStep.action";
import { ROUTES } from "@/lib/constants/routes";

import CustomButton from "./CustomButton";

type SaveStepProps = {
  label: string;
  onboardingStep: OnboardingStep;
  nextRoute: keyof typeof ROUTES;
};

const SaveStepFooter = ({
  label,
  onboardingStep,
  nextRoute,
}: SaveStepProps) => {
  const [isLoading, setLoading] = useState(false);

  const { update } = useSession();
  const router = useRouter();

  const saveStepAndContinue = async () => {
    setLoading(true);

    try {
      const onboardingRes = await updateOnboardingStep({
        onboardingStep,
      }).catch(console.log);

      if (onboardingRes?.success) {
        await update(onboardingStep);

        router.push(ROUTES[nextRoute]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="flex w-full place-content-center">
      <CustomButton
        isLoading={isLoading}
        variant="ghost"
        className="btn-outline !min-w-min !font-normal"
        onClick={saveStepAndContinue}
      >
        {label}
      </CustomButton>
    </footer>
  );
};

export default SaveStepFooter;
