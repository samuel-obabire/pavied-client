"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/auth";

export const verifySession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});
