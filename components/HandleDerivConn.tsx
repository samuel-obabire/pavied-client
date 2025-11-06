"use client";

import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { setDerivCookie } from "@/lib/actions/deriv.action";
import { ROUTES } from "@/lib/constants/routes";

const HandleDerivConn = () => {
  const stringifiedSearchParams = useSearchParams().toString();

  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status !== "authenticated") return;

    (async () => {
      const response = await setDerivCookie(stringifiedSearchParams);

      if (response.success) {
        if (session.data.user.onboardingStep === "deriv")
          return router.replace(ROUTES.ONBOARD_DERIV);
        router.replace(ROUTES.CONNECT_DERIV);
      }
    })();
  }, [router, stringifiedSearchParams, session.status, session.data]);

  return (
    <div className="flex-center mt-16 flex">
      <Loader className="animate-spin" />
    </div>
  );
};

export default HandleDerivConn;
