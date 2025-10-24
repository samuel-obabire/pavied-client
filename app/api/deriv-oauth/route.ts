import { NextRequest, NextResponse } from "next/server";

import { ROUTES } from "@/lib/constants/routes";

// GET api/deriv-oauth
export async function GET(request: NextRequest) {
  const stringifiedSearchParams = request.nextUrl.searchParams.toString();

  const response = NextResponse.redirect(
    new URL(ROUTES.CONNECT_DERIV, request.url)
  );

  response.cookies.set("deriv-accounts", stringifiedSearchParams, {
    maxAge: 900, // valid for 15mins
    secure: true,
    httpOnly: true,
    sameSite: "none",
    path: "/",
  });
}
