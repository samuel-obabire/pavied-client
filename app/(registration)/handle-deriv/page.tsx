import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const HandleDerivRedirectPage = async () => {
  const user = await verifySession();

  if (!user?.id) redirect(ROUTES.SIGN_IN);

  redirect(ROUTES.CONNECT_DERIV);

  return null;
};

export default HandleDerivRedirectPage;
