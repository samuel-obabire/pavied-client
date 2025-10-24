"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

import { setDerivCookie } from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";

const HandleDerivConn = () => {
  const stringifiedSearchParams = useSearchParams().toString();
  const router = useRouter();

  useLayoutEffect(() => {
    (async () => {
      const response = await setDerivCookie(stringifiedSearchParams);

      if (response.success) {
        router.replace(ROUTES.CONNECT_DERIV);
      }
    })();
  }, [router, stringifiedSearchParams]);

  return null;
};

export default HandleDerivConn;
