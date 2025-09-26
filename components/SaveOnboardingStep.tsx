"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { updateOnboardingStep } from "@/lib/actions/onboadingStep.action";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

import CustomButton from "./CustomButton";

type SaveStepProps = {
  label: string;
  onboardingStep: OnboardingStep;
  nextRoute: keyof typeof ROUTES;
  buttonClass?: string;
};

const SaveOnboardingStep = ({
  label,
  onboardingStep,
  nextRoute,
  buttonClass,
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
        await update({ trigger: "update" });

        router.push(ROUTES[nextRoute]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full place-content-center">
      <CustomButton
        isLoading={isLoading}
        variant="ghost"
        className={cn("btn-outline !font-normal w-full", buttonClass)}
        onClick={saveStepAndContinue}
      >
        {label}
      </CustomButton>
    </div>
  );
};

export default SaveOnboardingStep;
