import { NextRequest, NextResponse } from "next/server";

import { ROUTES } from "@/lib/constants/routes";

// GET api/deriv-oauth
export async function GET(request: NextRequest) {
  const stringifiedSearchParams = request.nextUrl.searchParams.toString();

  const response = NextResponse.redirect(
    new URL(ROUTES.HANDLE_DERIV, request.url),
    { status: 303 }
  );

  response.cookies.set("deriv-accounts", stringifiedSearchParams, {
    maxAge: 900,
    secure: true,
    httpOnly: true,
    sameSite: "none",
    path: "/",
  });

  return response;
}
