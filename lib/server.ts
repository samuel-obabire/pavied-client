"use server";

import { auth } from "@/auth";

export const verifySession = async () => {
  const session = await auth();
  return session?.user;
};
