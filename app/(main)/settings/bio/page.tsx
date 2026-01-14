import { redirect } from "next/navigation";
import ProfileSettingsForm from "@/components/forms/ProfileSettingsForm";
import { getUserById } from "@/lib/actions/user.action";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

const SettingsBioPage = async () => {
  const sessionUser = await verifySession();
  if (!sessionUser || !sessionUser.id) redirect(ROUTES.SIGN_IN);

  const { data: user } = await getUserById(sessionUser.id);
  if (!user) redirect(ROUTES.SIGN_IN);

  return (
    <div className="max-w-2xl bg-white_dark-black-1 rounded-2xl p-6 md:p-10 shadow-sm border border-gray-200/30">
      <ProfileSettingsForm user={user} />
    </div>
  );
};

export default SettingsBioPage;
