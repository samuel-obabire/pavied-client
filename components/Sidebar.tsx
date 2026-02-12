"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { sideLinks } from "@/lib/constants/sideLinks";
import { cn } from "@/lib/utils";

import BrandName from "./BrandName";
import ProfileLogout from "./ProfileLogout";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-white_dark-black-1 sticky top-0 left-0 hidden h-screen w-full flex-col border-r border-gray-200 dark:border-gray-800 lg:flex lg:w-[260px]">
      <div className="p-6">
        <BrandName />
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 pb-6">
        <nav aria-label="Main" className="flex-1 space-y-6 overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {sideLinks.map((link) => {
              if (link.deposit && link.withdrawal) {
                return (
                  <React.Fragment key={link.deposit.href}>
                    <div className="px-2 py-2">
                      <p className="text-12-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </p>
                    </div>

                    <Accordion
                      type="single"
                      defaultValue="deriv-item"
                      collapsible
                      className="border-none"
                    >
                      <AccordionItem value="deriv-item" className="border-none">
                        <AccordionTrigger className="hover:bg-primary/5 text-14-medium rounded-lg px-3 py-2 text-gray-700 transition-colors hover:no-underline dark:text-gray-300">
                          Deriv Transaction
                        </AccordionTrigger>
                        <AccordionContent className="pb-0 pl-4 pt-1">
                          <Link href={link.deposit.href}>
                            <li
                              className={cn(
                                "flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                                {
                                  "bg-primary text-white shadow-md shadow-primary/20":
                                    pathname === link.deposit.href,
                                  "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5":
                                    pathname !== link.deposit.href,
                                }
                              )}
                            >
                              <link.deposit.Icon size={18} />
                              {link.deposit.label}
                            </li>
                          </Link>

                          <Link href={link.withdrawal.href} className="mt-1 block">
                            <li
                              className={cn(
                                "flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                                {
                                  "bg-primary text-white shadow-md shadow-primary/20":
                                    pathname === link.withdrawal.href,
                                  "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5":
                                    pathname !== link.withdrawal.href,
                                }
                              )}
                            >
                              <link.withdrawal.Icon size={18} />
                              {link.withdrawal.label}
                            </li>
                          </Link>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </React.Fragment>
                );
              }

              const { Icon, href, label } = link;
              const isActive =
                pathname === href ||
                (label === "Settings" && pathname.startsWith("/settings"));

              return (
                <React.Fragment key={href}>
                  
                  {/* <Divider /> */}

                  <Link href={href}>
                    <li
                      className={cn(
                        "flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                        {
                          "bg-primary text-white shadow-md shadow-primary/20": isActive,
                          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-100":
                            !isActive,
                        }
                      )}
                    >
                      <Icon size={20} className={cn({ "text-white": isActive, "text-gray-500 dark:text-gray-400": !isActive })} /> 
                      {label}
                    </li>
                  </Link>
                </React.Fragment>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-gray-200 pt-6 dark:border-gray-800">
          <ProfileLogout />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
