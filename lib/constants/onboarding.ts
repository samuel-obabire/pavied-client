import { OnboardingStep } from "@/prisma/lib/generated/prisma/enums";
import { ROUTES } from "./routes";

export const onBoardingRoutes = [
  ROUTES.ONBOARD_BIO,
  ROUTES.ONBOARD_DERIV,
  ROUTES.ONBOARD_BANK,
];

export const pathnameToStep: Record<string, OnboardingStep> = {
  [ROUTES.ONBOARD_BIO]: OnboardingStep.BIO,
  [ROUTES.ONBOARD_DERIV]: OnboardingStep.DERIV,
  [ROUTES.ONBOARD_BANK]: OnboardingStep.BANK,
};

export const stepToRoute: Record<OnboardingStep, string> = {
  [OnboardingStep.BIO]: ROUTES.ONBOARD_BIO,
  [OnboardingStep.DERIV]: ROUTES.ONBOARD_DERIV,
  [OnboardingStep.BANK]: ROUTES.ONBOARD_BANK,
  [OnboardingStep.COMPLETE]: ROUTES.DASHBOARD,
};
