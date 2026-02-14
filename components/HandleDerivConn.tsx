"use client";

import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { setDerivCookie } from "@/lib/actions/deriv.action";
import { useSession } from "@/lib/auth-client";
import { ROUTES } from "@/lib/constants/routes";

const HandleDerivConn = () => {
  const stringifiedSearchParams = useSearchParams().toString();

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    (async () => {
      const response = await setDerivCookie(stringifiedSearchParams);

      if (response.success) {
        if (session.user.onboardingStep === "deriv")
          return router.replace(ROUTES.ONBOARD_DERIV);
        router.replace(ROUTES.CONNECT_DERIV);
      }
    })();
  }, [router, stringifiedSearchParams, session]);

  return (
    <div className="flex-center  flex">
      <Loader className="animate-spin" />
    </div>
  );
};

export default HandleDerivConn;
