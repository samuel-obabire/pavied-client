import { type NextRequest, NextResponse } from "next/server";
import { api } from "./lib/api";
import {
  onBoardingRoutes,
  pathnameToStep,
  stepToRoute,
} from "./lib/constants/onboarding";
import { ROUTES } from "./lib/constants/routes";
import logger from "./lib/logger";
import { verifySession } from "./lib/server";
import type { OnboardingStep } from "./prisma/lib/generated/prisma/enums";

const publicRoutes = [
  ROUTES.HOME,
  ROUTES.HANDLE_DERIV,
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.EMAIL_VERIFICATION_RESULT,
  ROUTES.EMAIL_VERIFICATION,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.CONTACT,
  ROUTES.VERIFY_DERIV_DEPOSIT,
  ROUTES.CANCEL_ORDER,
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json",
];

export async function proxy(request: NextRequest) {
  const session = await verifySession();
  const user = session?.user;

  const pathname = request.nextUrl.pathname;

  const redirect = (route: string) =>
    NextResponse.redirect(new URL(route, request.url));

  // Redirect to sign-in if no user and not on a public route
  if (!user?.id && !publicRoutes.includes(pathname)) {
    const newUrl = new URL(ROUTES.SIGN_IN, request.url);
    newUrl.searchParams.set("callback", pathname);

    return NextResponse.redirect(newUrl);
  }

  // If user is on the onboarding route
  if (user && onBoardingRoutes.includes(pathname)) {
    try {
      const { success, data } = await api.users.getById(user.id);

      if (!success || !data) {
        throw new Error("User not found in middleware fetch");
      }

      const onboardingStep = data.onboardingStep;

      // Add second guard to prevent redirect loop
      if (onboardingStep && onboardingStep !== pathnameToStep[pathname]) {
        return redirect(stepToRoute[onboardingStep]);
      }
    } catch (err) {
      logger.error({ err, pathname }, "Onboarding middleware error");
      const response = NextResponse.redirect(
        new URL(ROUTES.SIGN_IN, request.url),
      );
      // Clear session cookies to force logout if user data is invalid
      response.cookies.delete("authjs.session-token");
      response.cookies.delete("__Secure-authjs.session-token");
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("__Secure-next-auth.session-token");
      return response;
    }
  }

  // User must finish boarding before they can access other pages
  if (
    user?.id &&
    !onBoardingRoutes.includes(pathname) &&
    !publicRoutes.includes(pathname)
  ) {
    if (
      user?.onboardingStep !== ("COMPLETE" as OnboardingStep) &&
      pathname !== ROUTES.CONNECT_DERIV
    ) {
      return redirect(stepToRoute[user.onboardingStep as OnboardingStep]);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
