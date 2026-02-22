import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const SettingsPage = async () => {
  const session = await verifySession();
  const sessionUser = session?.user;
  if (!sessionUser || !sessionUser.id) redirect(ROUTES.SIGN_IN);

  redirect(ROUTES.SETTINGS_BIO);
};

export default SettingsPage;
