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

const publicRoutes = [ROUTES.HOME, ROUTES.HANDLE_DERIV];

export async function middleware(request: NextRequest) {
  const user = await verifySession();

  const pathname = request.nextUrl.pathname;

  const redirect = (route: string) =>
    NextResponse.redirect(new URL(route, request.url));

  // Redirect to sign-in if no user and not on a public route
  if (!user?.id && !publicRoutes.includes(pathname)) {
    const newUrl = new URL(ROUTES.HOME, request.url);
    newUrl.searchParams.set("callback", pathname);

    return NextResponse.redirect(newUrl);
  }

  // If user is on the onboarding route
  if (onBoardingRoutes.includes(pathname)) {
    try {
      const { success, data } = await api.users.getById(user!.id!);

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
      return redirect(ROUTES.HOME);
    }
  }

  // User must finish boarding before they can access other pages
  if (
    user?.id &&
    !onBoardingRoutes.includes(pathname) &&
    !publicRoutes.includes(pathname)
  ) {
    if (
      user?.onboardingStep !== "complete" &&
      pathname !== ROUTES.CONNECT_DERIV
    ) {
      return redirect(stepToRoute[user?.onboardingStep ?? "bio"]);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
