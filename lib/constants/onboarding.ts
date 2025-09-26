/* eslint-disable no-unused-vars */

import { ROUTES } from "./routes";

export enum OnboardingStep {
  REGISTER = "bio",
  SETUP_DERIV = "deriv",
  SETUP_BANK = "bank",
  COMPLETE = "complete",
}

export const onBoardingRoutes = [
  ROUTES.ONBOARD_BIO,
  ROUTES.ONBOARD_DERIV,
  ROUTES.ONBOARD_BANK,
];

export const pathnameToStep: Record<string, OnboardingStep> = {
  [ROUTES.ONBOARD_BIO]: OnboardingStep.REGISTER,
  [ROUTES.ONBOARD_DERIV]: OnboardingStep.SETUP_DERIV,
  [ROUTES.ONBOARD_BANK]: OnboardingStep.SETUP_BANK,
};

export const stepToRoute: Record<OnboardingStep, string> = {
  [OnboardingStep.REGISTER]: ROUTES.ONBOARD_BIO,
  [OnboardingStep.SETUP_DERIV]: ROUTES.ONBOARD_DERIV,
  [OnboardingStep.SETUP_BANK]: ROUTES.ONBOARD_BANK,
  [OnboardingStep.COMPLETE]: ROUTES.DASHBOARD,
};
