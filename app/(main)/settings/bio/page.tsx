import { redirect } from "next/navigation";
import Link from "next/link";

import ProfileSettingsForm from "@/components/forms/ProfileSettingsForm";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";
import { getUserById } from "@/lib/firebase/user";

const SettingsBioPage = async () => {
  const sessionUser = await verifySession();
  if (!sessionUser || !sessionUser.id) redirect(ROUTES.SIGN_IN);

  const user = await getUserById(sessionUser.id);
  if (!user) redirect(ROUTES.SIGN_IN);

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <h2 className="text-18-bold text-black-1_dark-white px-2">
            Account settings
          </h2>
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  href={ROUTES.SETTINGS_BIO}
                  className="group relative flex items-center rounded-lg bg-secondary/10 px-4 py-3 text-16-medium text-secondary transition-all"
                >
                  Profile settings
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-secondary rounded-l-full" />
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl">
          <div className="bg-white_dark-black-1 rounded-2xl p-6 md:p-10 shadow-sm border border-gray-200/30">
            <ProfileSettingsForm user={user} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsBioPage;
