"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    label: "Profile settings",
    href: ROUTES.SETTINGS_BIO,
  },
  {
    label: "Bank account",
    href: ROUTES.SETUP_BANK,
  },
  {
    label: "Deriv account",
    href: ROUTES.SETUP_DERIV,
  },
  {
    label: "Password & Security",
    href: ROUTES.SETTINGS_PASSWORD,
  },
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="py-8">
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <h2 className="text-18-bold text-black-1_dark-white px-2">
            Account settings
          </h2>
          <nav>
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative flex items-center rounded-lg px-4 py-3 text-16-medium transition-all",
                        isActive
                          ? "bg-secondary/10 text-secondary"
                          : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-secondary rounded-l-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
