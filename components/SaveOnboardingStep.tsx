"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOnboardingStep } from "@/lib/actions/onboadingStep.action";
import { useSession } from "@/lib/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/prisma/lib/generated/prisma/client";
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

  const { refetch } = useSession();
  const router = useRouter();

  const saveStepAndContinue = async () => {
    setLoading(true);

    try {
      const onboardingRes = await updateOnboardingStep({
        onboardingStep,
      }).catch(console.log);

      if (onboardingRes?.success) {
        // force fetch session from db
        await refetch({ query: { disableCookieCache: true } });

        const route = ROUTES[nextRoute];
        if (typeof route === "string") {
          router.push(route);
        } else {
          console.error(
            "Selected route requires parameters or is not a string route:",
            nextRoute,
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full place-content-center">
      <CustomButton
        isLoading={isLoading}
        className={cn("btn-secondary w-full", buttonClass)}
        onClick={saveStepAndContinue}
      >
        {label}
      </CustomButton>
    </div>
  );
};

export default SaveOnboardingStep;
